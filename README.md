# AdGenius AI

**Spin product images into viral ad variations, automatically posted for testing.**

AdGenius AI is a comprehensive web application that helps e-commerce sellers and marketers quickly generate and test multiple social media ad creatives from a single product image using AI-powered tools.

## 🚀 Features

### Core Features

- **🤖 AI-Powered Ad Creation**: Upload a single product image and generate 3-5 distinct ad variations with different captions, styles, and calls-to-action
- **📱 Cross-Platform Adaptation**: Automatically formats and optimizes generated ad creatives for different social media platforms (Farcaster, Instagram, TikTok)
- **🔄 Automated Posting & Testing**: Automatically posts generated ad variations to designated test social media accounts and tracks basic engagement metrics
- **📊 AI Growth Hacking Agent**: Analyzes performance data, identifies trends, and suggests optimization strategies

### Technical Features

- **🔐 Secure Authentication**: Supabase-powered authentication with user profiles
- **💳 Subscription Management**: Stripe integration for tiered subscription plans
- **📈 Advanced Analytics**: Comprehensive performance tracking and insights
- **🎨 Modern UI/UX**: Responsive design with Tailwind CSS and custom components
- **☁️ Cloud Storage**: Supabase storage for product images and generated content

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI Services**: OpenAI GPT-4 & DALL-E
- **Social Media**: Farcaster (via Neynar API)
- **Payments**: Stripe
- **Deployment**: Docker-ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git

You'll also need accounts and API keys for:

- [Supabase](https://supabase.com) (Database & Auth)
- [OpenAI](https://platform.openai.com) (AI Generation)
- [Neynar](https://neynar.com) (Farcaster API)
- [Stripe](https://stripe.com) (Payments)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-3396.git
cd this-is-a-3396
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Farcaster/Neynar Configuration
VITE_NEYNAR_API_KEY=your_neynar_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 4. Database Setup

1. Create a new Supabase project
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL to create all tables, policies, and functions

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AdVariations.jsx
│   ├── ImageUploader.jsx
│   ├── PlatformSelector.jsx
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── lib/               # Core services and utilities
│   ├── supabase.js    # Database client
│   ├── openai.js      # AI generation service
│   ├── farcaster.js   # Social media integration
│   ├── stripe.js      # Payment processing
│   ├── database.js    # Database operations
│   ├── aiAgent.js     # AI Growth Hacking Agent
│   └── utils.js       # Utility functions
├── pages/             # Main application pages
│   ├── Dashboard.jsx
│   ├── CreateProject.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
└── App.jsx           # Main application component
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database schema from `database/schema.sql`
4. Configure Row Level Security (RLS) policies (included in schema)

### OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com)
2. Ensure you have access to GPT-4 and DALL-E APIs
3. Monitor usage to manage costs

### Farcaster Setup

1. Sign up for [Neynar](https://neynar.com) to get Farcaster API access
2. Get your API key from the Neynar dashboard
3. Configure webhook endpoints for real-time updates (optional)

### Stripe Setup

1. Create a Stripe account and get your publishable key
2. Set up webhook endpoints for subscription events
3. Configure subscription products matching the plans in `src/lib/stripe.js`

## 🏗️ Deployment

### Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t adgenius-ai .

# Run the container
docker run -p 3000:3000 adgenius-ai
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables on your hosting platform
4. Set up domain and SSL certificate

## 📊 Subscription Plans

The application supports tiered subscription plans:

### Basic Plan - $15/month
- 50 ad generations per month
- 10 auto-posts per month
- Basic analytics
- Farcaster integration

### Pro Plan - $49/month
- Unlimited ad generations
- 50 auto-posts per month
- Advanced analytics
- All platform integrations
- AI Growth Hacking Agent
- Priority support

## 🔒 Security

- **Row Level Security (RLS)**: All database operations are secured with RLS policies
- **Authentication**: Supabase Auth handles user authentication and session management
- **API Keys**: All sensitive keys are stored as environment variables
- **CORS**: Properly configured for production deployment
- **Input Validation**: All user inputs are validated and sanitized

## 🧪 Testing

Run the test suite:

```bash
npm test
```

For development with mock data (when API keys are not configured), the application will automatically use mock responses to allow for testing and development.

## 📈 Analytics & Monitoring

The application includes comprehensive analytics:

- **Performance Metrics**: Track views, likes, shares, comments for each ad variation
- **Platform Comparison**: Compare performance across different social media platforms
- **AI Insights**: Get AI-powered recommendations for optimization
- **Usage Tracking**: Monitor subscription usage and limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 API Documentation

### Core Services

#### OpenAI Integration (`src/lib/openai.js`)
- `generateAdVariations(imageUrl, productName, platform)` - Generate ad variations
- `generateImageVariation(imageUrl, prompt)` - Create image variations

#### Farcaster Integration (`src/lib/farcaster.js`)
- `postToFarcaster(adVariation, signerUuid)` - Post content to Farcaster
- `getFarcasterMetrics(castHash)` - Get performance metrics
- `connectFarcasterAccount(userId)` - Connect social account

#### Database Operations (`src/lib/database.js`)
- `projectService` - CRUD operations for projects
- `adVariationService` - Manage ad variations
- `analyticsService` - Performance analytics

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies are properly configured
   - Ensure database schema is up to date

2. **API Rate Limits**
   - Monitor OpenAI usage and billing
   - Implement proper error handling for rate limits
   - Consider caching strategies for frequently accessed data

3. **Authentication Problems**
   - Clear browser storage and cookies
   - Verify Supabase Auth configuration
   - Check redirect URLs in Supabase dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for AI generation capabilities
- [Supabase](https://supabase.com) for backend infrastructure
- [Farcaster](https://farcaster.xyz) for decentralized social networking
- [Stripe](https://stripe.com) for payment processing
- [Tailwind CSS](https://tailwindcss.com) for styling

## 📞 Support

For support, email support@adgenius.ai or create an issue in this repository.

---

**Built with ❤️ for the future of social media marketing**
