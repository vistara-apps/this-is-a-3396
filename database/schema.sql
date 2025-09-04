-- AdGenius AI Database Schema
-- This file contains the complete database schema for the AdGenius AI application
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    "userId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'basic' CHECK ("subscriptionTier" IN ('basic', 'pro', 'enterprise')),
    "paymentMethodId" TEXT,
    "socialMediaAccounts" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    "projectId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users("userId") ON DELETE CASCADE,
    "productName" TEXT NOT NULL,
    "productImageURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad variations table
CREATE TABLE IF NOT EXISTS "adVariations" (
    "adVariationId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "projectId" UUID NOT NULL REFERENCES projects("projectId") ON DELETE CASCADE,
    "generatedImageURL" TEXT NOT NULL,
    "generatedCaption" TEXT NOT NULL,
    "platformTarget" TEXT NOT NULL CHECK ("platformTarget" IN ('farcaster', 'instagram', 'tiktok')),
    "postStatus" TEXT NOT NULL DEFAULT 'draft' CHECK ("postStatus" IN ('draft', 'posted', 'failed')),
    "performanceMetrics" JSONB DEFAULT '{}',
    "castHash" TEXT, -- For Farcaster posts
    "postUrl" TEXT, -- URL to the posted content
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects("userId");
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_ad_variations_project_id ON "adVariations"("projectId");
CREATE INDEX IF NOT EXISTS idx_ad_variations_platform ON "adVariations"("platformTarget");
CREATE INDEX IF NOT EXISTS idx_ad_variations_status ON "adVariations"("postStatus");
CREATE INDEX IF NOT EXISTS idx_ad_variations_created_at ON "adVariations"("createdAt" DESC);

-- Function to update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updatedAt
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_variations_updated_at BEFORE UPDATE ON "adVariations"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE "adVariations" ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can create own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid()::text = "userId"::text);

-- Ad variations policies
CREATE POLICY "Users can view own ad variations" ON "adVariations"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects."projectId" = "adVariations"."projectId" 
            AND projects."userId"::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can create ad variations for own projects" ON "adVariations"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects."projectId" = "adVariations"."projectId" 
            AND projects."userId"::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own ad variations" ON "adVariations"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects."projectId" = "adVariations"."projectId" 
            AND projects."userId"::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own ad variations" ON "adVariations"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects."projectId" = "adVariations"."projectId" 
            AND projects."userId"::text = auth.uid()::text
        )
    );

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Users can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Users can update own product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Sample data for development (optional)
-- Uncomment the following lines if you want to insert sample data

/*
-- Insert sample user (this would normally be handled by Supabase Auth)
INSERT INTO users ("userId", email, "subscriptionTier", "socialMediaAccounts") 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'demo@adgenius.ai',
    'pro',
    '{"farcaster": {"connected": true, "username": "demouser", "signerUuid": "demo-signer-123"}}'
) ON CONFLICT ("userId") DO NOTHING;

-- Insert sample project
INSERT INTO projects ("projectId", "userId", "productName", "productImageURL")
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Wireless Headphones',
    'https://picsum.photos/400/400?random=1'
) ON CONFLICT ("projectId") DO NOTHING;

-- Insert sample ad variations
INSERT INTO "adVariations" ("adVariationId", "projectId", "generatedImageURL", "generatedCaption", "platformTarget", "postStatus", "performanceMetrics")
VALUES 
(
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'https://picsum.photos/400/400?random=1',
    '🔥 Just discovered these amazing wireless headphones and I''m obsessed! Who else needs this in their life?',
    'farcaster',
    'posted',
    '{"views": 1250, "likes": 89, "shares": 23, "comments": 15, "clickThroughRate": 3.2}'
),
(
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    'https://picsum.photos/400/400?random=2',
    '⚡ Limited time: Get these wireless headphones before everyone else finds out about them!',
    'farcaster',
    'posted',
    '{"views": 980, "likes": 67, "shares": 18, "comments": 12, "clickThroughRate": 2.8}'
);
*/

-- Views for analytics (optional but useful)
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
    u."userId",
    u.email,
    u."subscriptionTier",
    COUNT(DISTINCT p."projectId") as total_projects,
    COUNT(DISTINCT av."adVariationId") as total_variations,
    COALESCE(SUM((av."performanceMetrics"->>'views')::int), 0) as total_views,
    COALESCE(SUM((av."performanceMetrics"->>'likes')::int), 0) as total_likes,
    COALESCE(SUM((av."performanceMetrics"->>'shares')::int), 0) as total_shares,
    COALESCE(SUM((av."performanceMetrics"->>'comments')::int), 0) as total_comments,
    u."createdAt" as user_created_at
FROM users u
LEFT JOIN projects p ON u."userId" = p."userId"
LEFT JOIN "adVariations" av ON p."projectId" = av."projectId"
GROUP BY u."userId", u.email, u."subscriptionTier", u."createdAt";

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE (
    total_projects BIGINT,
    total_variations BIGINT,
    total_views BIGINT,
    total_engagements BIGINT,
    avg_engagement_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT p."projectId") as total_projects,
        COUNT(DISTINCT av."adVariationId") as total_variations,
        COALESCE(SUM((av."performanceMetrics"->>'views')::int), 0) as total_views,
        COALESCE(
            SUM((av."performanceMetrics"->>'likes')::int) + 
            SUM((av."performanceMetrics"->>'shares')::int) + 
            SUM((av."performanceMetrics"->>'comments')::int), 
            0
        ) as total_engagements,
        CASE 
            WHEN COALESCE(SUM((av."performanceMetrics"->>'views')::int), 0) > 0 THEN
                ROUND(
                    (COALESCE(
                        SUM((av."performanceMetrics"->>'likes')::int) + 
                        SUM((av."performanceMetrics"->>'shares')::int) + 
                        SUM((av."performanceMetrics"->>'comments')::int), 
                        0
                    ) * 100.0) / COALESCE(SUM((av."performanceMetrics"->>'views')::int), 1),
                    2
                )
            ELSE 0
        END as avg_engagement_rate
    FROM projects p
    LEFT JOIN "adVariations" av ON p."projectId" = av."projectId"
    WHERE p."userId" = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE users IS 'User profiles and subscription information';
COMMENT ON TABLE projects IS 'User projects containing product information';
COMMENT ON TABLE "adVariations" IS 'Generated ad variations for each project';
COMMENT ON COLUMN "adVariations"."performanceMetrics" IS 'JSON object containing views, likes, shares, comments, and other metrics';
COMMENT ON COLUMN "adVariations"."castHash" IS 'Farcaster cast hash for tracking posted content';
COMMENT ON COLUMN users."socialMediaAccounts" IS 'JSON object containing connected social media account information';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'AdGenius AI database schema has been successfully created!';
    RAISE NOTICE 'Tables created: users, projects, adVariations';
    RAISE NOTICE 'Storage bucket created: product-images';
    RAISE NOTICE 'RLS policies and triggers are active';
    RAISE NOTICE 'You can now start using the application!';
END $$;
