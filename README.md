# Amogh Ramagiri's Portfolio

A modern, responsive portfolio website showcasing the work and expertise of Amogh G. Ramagiri - Data Scientist, Developer, and AI Enthusiast. Built with cutting-edge web technologies and featuring an AI-powered chatbot for interactive engagement.

## 🌟 Features

### 🎨 **Modern Design**
- Glass morphism UI with beautiful animations
- Dark/Light theme toggle with system preference detection
- Responsive design optimized for all devices
- Professional photography portfolio section

### 🤖 **AI-Powered Chatbot**
- Interactive assistant powered by Groq's LLaMA 3.1-8B model
- Context-aware responses about Amogh's background and projects
- Real-time conversation with professional information
- Smart contact form integration

### 📊 **Professional Showcase**
- Comprehensive skills visualization with icons
- Experience timeline with detailed work history
- Project gallery with live demos and GitHub links
- Downloadable resume integration

### 🚀 **Performance & Analytics**
- Vercel Speed Insights integration
- Vercel Analytics for user behavior tracking
- Optimized images and lazy loading
- SEO-friendly structure

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Custom theming with CSS-in-JS
- **Fonts**: Inter & Raleway (Google Fonts)

### **AI & Backend**
- **AI Model**: Groq LLaMA 3.1-8B Instant
- **API Routes**: Next.js API routes for chat and contact
- **Database**: Supabase (for contact form submissions)
- **Context Building**: Custom resume context system

### **DevOps & Deployment**
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics & Speed Insights
- **Environment**: Node.js with TypeScript
- **Package Manager**: npm

### **Data Management**
- **Configuration**: JSON-based data structure
- **Content**: Modular component architecture
- **State**: React Context for theme management

## 🗂 Project Structure

```
my-portfolio/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/           # Main page sections
│   │   │   ├── chatbot/        # AI chatbot components
│   │   │   └── admin/          # Admin components
│   │   ├── api/
│   │   │   ├── chat/           # Groq AI integration
│   │   │   └── contact/        # Contact form handler
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── contexts/
│   │   └── ThemeContext.tsx    # Theme management
│   ├── data/                   # JSON configuration files
│   ├── lib/                    # Utility functions
│   └── components/             # Shared components
├── public/
│   ├── images/                 # Portfolio images
│   └── documents/              # Resume and documents
├── data/
│   ├── personal.json           # Personal information
│   ├── experience.json         # Work experience
│   ├── projects.json           # Portfolio projects
│   └── contacts.json           # Contact information
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Required API Keys

To run the full application, you'll need:
- **Groq API Key** - [Get it free from Groq](https://console.groq.com/)
- **Supabase Account** - [Sign up at Supabase](https://supabase.com/)

### 📥 Installation & Setup

#### Step 1: Clone the Repository
```bash
# Clone the repository
git clone https://github.com/itsamoghgr/my-portfolio.git

# Navigate to the project directory
cd my-portfolio
```

#### Step 2: Install Dependencies
```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install
```

#### Step 3: Environment Configuration
Create a `.env.local` file in the root directory and add your environment variables:

```env
# Groq AI Configuration (Required for chatbot)
GROQ_API_KEY=your_groq_api_key_here

# Supabase Configuration (Required for contact form)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Vercel Analytics (for production)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

**🔑 How to get API keys:**

**For Groq API:**
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up/Login with your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

**For Supabase:**
1. Visit [Supabase](https://supabase.com/) and create an account
2. Create a new project
3. Go to Project Settings → API
4. Copy the Project URL and anon public key
5. Add them to your `.env.local` file

#### Step 4: Data Customization (Optional)
If you want to customize the portfolio with your own information:

```bash
# Update personal information
nano data/personal.json

# Update experience data
nano data/experience.json

# Update projects data
nano data/projects.json

# Update contact information
nano data/contacts.json
```

#### Step 5: Run the Development Server
```bash
# Start the development server
npm run dev

# Or with yarn
yarn dev

# Or with pnpm
pnpm dev
```

#### Step 6: View the Application
Open your browser and navigate to:
- **Local Development**: [http://localhost:3000](http://localhost:3000)
- The app will automatically reload when you make changes

### 🏗 Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start

# Or build and export static files
npm run build && npm run export
```

### 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run export       # Export static files

# Linting and Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically

# Type Checking
npm run type-check   # Run TypeScript compiler check
```

### 🔧 Development Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

## 🎯 Key Sections

### **Hero Section**
- Animated typewriter effect displaying roles
- Professional social media links
- Responsive gradient background

### **About Section**
- Professional profile with photo
- Technical skills with categorized icons
- Core competencies listing
- Personal background story

### **Experience Section**
- Timeline of work experience
- Educational background
- Skills and technologies used

### **Projects Section**
- Featured portfolio projects
- Live demo and GitHub links
- Technology stack for each project

### **Contact Section**
- Contact form with Supabase integration
- Professional contact information
- Social media links

### **AI Chatbot**
- Context-aware responses about Amogh
- Project information and links
- Professional background details
- Contact form integration

## 🔧 Configuration

### **Personal Data**
Update `data/personal.json` with your information:
- Personal details and bio
- Technical and soft skills
- Social media links
- Resume information

### **Experience Data**
Modify `data/experience.json` to include:
- Work experience with descriptions
- Educational background
- Skills for each position

### **Projects Data**
Edit `data/projects.json` to showcase:
- Portfolio projects with descriptions
- GitHub repository links
- Live demo URLs
- Technology stacks

## 📱 Responsive Design

- **Mobile-first** approach
- **Tablet** optimized layouts
- **Desktop** enhanced experience
- **Touch-friendly** interactions

## 🔮 AI Features

### **Chatbot Capabilities**
- Professional background inquiries
- Project information and links
- Skills and experience details
- Contact form assistance
- Context-aware conversations

### **Smart Responses**
- Resume-based context building
- Project link prioritization
- Professional tone maintenance
- Interactive follow-up questions

### 🛠 Troubleshooting

#### Common Issues and Solutions

**1. Port 3000 already in use**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
npm run dev -- -p 3001
```

**2. Module not found errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
```

**3. Environment variables not working**
- Ensure `.env.local` file is in the root directory
- Restart the development server after adding new variables
- Check that variables start with `NEXT_PUBLIC_` for client-side access

**4. Chatbot not responding**
- Verify your Groq API key is valid
- Check the browser console for error messages
- Ensure the API key has proper permissions

**5. Contact form not working**
- Verify Supabase URL and key are correct
- Check Supabase project is active
- Ensure proper table structure in Supabase

**6. Build failures**
```bash
# Check for TypeScript errors
npm run type-check

# Fix linting issues
npm run lint:fix

# Clear cache and rebuild
rm -rf .next
npm run build
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is optimized for deployment on Vercel:

#### Automatic Deployment
1. **Fork/Clone** this repository to your GitHub account
2. **Visit** [Vercel](https://vercel.com/) and sign up with GitHub
3. **Import** your repository from the Vercel dashboard
4. **Configure** environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local` file
5. **Deploy** automatically on every push to main branch

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Alternative Deployment Options

#### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify (requires Netlify CLI)
npm i -g netlify-cli
netlify deploy --prod --dir=out
```

#### Docker Deployment
```dockerfile
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run Docker container
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## 📈 Analytics

- **Vercel Analytics**: User engagement tracking
- **Speed Insights**: Performance monitoring
- **Custom Events**: Chatbot interactions

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Amogh G. Ramagiri**
- **Website**: [amoghramagiri.com](https://amoghramagiri.com)
- **LinkedIn**: [linkedin.com/in/amoghgr](https://linkedin.com/in/amoghgr)
- **GitHub**: [github.com/itsamoghgr](https://github.com/itsamoghgr)
- **Email**: Contact through the website form

---

*Built with ❤️ by Amogh Ramagiri using Next.js, TypeScript, and modern web technologies.*