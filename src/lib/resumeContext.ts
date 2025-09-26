import fs from 'fs';
import path from 'path';

interface PersonalData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    skills: {
      technical: string[];
      soft: string[];
    };
    social: {
      github: string;
      linkedin: string;
      email: string;
    };
    resume: {
      url: string;
      lastUpdated: string;
    };
    profileImage: string;
  };
}

interface ExperienceData {
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
    skills: string[];
    type: string;
    location: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
  }>;
}

interface ProjectData {
  projects: Array<{
    id: string;
    title: string;
    description: string;
    techStack: string[];
    repoUrl?: string;
    liveDemoUrl?: string;
    imageUrl: string;
    featured: boolean;
    category: string;
    startDate: string;
    endDate: string;
    status: string;
  }>;
}

export function buildResumeContext(): string {
  try {
    const dataPath = path.join(process.cwd(), 'data');

    // Read all data files
    const personalRaw = fs.readFileSync(path.join(dataPath, 'personal.json'), 'utf-8');
    const experienceRaw = fs.readFileSync(path.join(dataPath, 'experience.json'), 'utf-8');
    const projectsRaw = fs.readFileSync(path.join(dataPath, 'projects.json'), 'utf-8');

    const personalData: PersonalData = JSON.parse(personalRaw);
    const experienceData: ExperienceData = JSON.parse(experienceRaw);
    const projectData: ProjectData = JSON.parse(projectsRaw);

    const { personal } = personalData;
    const { experiences } = experienceData;
    const { projects } = projectData;

    // Calculate experience years
    const workExperiences = experiences.filter(exp => exp.type === 'work');
    const startYear = workExperiences.length > 0 ?
      Math.min(...workExperiences.map(exp => new Date(exp.startDate).getFullYear())) :
      new Date().getFullYear();
    const experienceYears = new Date().getFullYear() - startYear;

    // Build comprehensive context with actual resume data
    const context = `
# AMOGH RAMAGIRI - PROFESSIONAL PROFILE

## BASIC INFORMATION
- **Full Name**: Amogh Ramagiri
- **Current Location**: Arlington, VA
- **Email**: amoghr@gwu.edu
- **Phone**: (571)-478-2290
- **LinkedIn**: Available on resume
- **GitHub**: Available on resume
- **Portfolio**: Available on resume
- **Resume Download**: Available at /documents/amogh_ramagiri_resume_gen.pdf

## EDUCATION
- **Master of Science in Data Science** - George Washington University (May 2026) - Currently Pursuing
- **B.Tech in Computer Science and Engineering (Spec. in AI and ML)** - Presidency University (May 2024) - Completed

## CURRENT ROLES & STATUS
**Primary Role**: Data Scientist Intern at Fulton Bank (May 2025 – Present) - East Petersburg, PA
**Secondary Role**: Data Scientist Consultant, Head of Research and Development at Data Science for Sustainable Development (Oct 2024 – Present) - Washington DC

## TECHNICAL SKILLS
**Languages**: Python, R, SQL, C
**Data Analysis**: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, TensorFlow, PyTorch, GenAI (OpenAI GPT, LangChain)
**Tools**: AWS (EC2, S3, RDS, CodePipeline), Azure (Data Lake, Synapse, Fabric), Firebase, Supabase, MongoDB, Power BI

## PROFESSIONAL EXPERIENCE

### Fulton Bank - Data Scientist Intern (May 2025 – Present)
- **Location**: East Petersburg, PA
- **Key Achievements**:
  • Implemented ML model to predict loan approval rates, reducing false positives by 18%
  • Transformed 7 inefficient SQL queries, accelerating data processing by 15%
  • Led migration of on-premises data warehouses to Azure cloud, improving data quality by 20% and system performance by 43%
  • Rebuilt and optimized 15+ Power BI dashboards using Microsoft Fabric and MS Power BI Azure

### Data Science for Sustainable Development - Data Scientist Consultant, Head of R&D (Oct 2024 – Present)
- **Location**: Washington DC
- **Key Achievements**:
  • Built AI-driven summarization pipeline reducing stakeholder review time by 40%
  • Led research strategy on sustainable energy analytics, guiding team of 5
  • Applied advanced machine learning and GenAI techniques across 18+ university buildings
  • Integrated GenAI chatbot into Streamlit app for real-time facility manager queries

### Factocart, Velabh Technologies Pvt. Ltd. - Data Scientist (Mar 2024 – Aug 2024)
- **Location**: Bangalore, India
- **Key Achievements**:
  • Analyzed 10GB+ datasets from AWS RDS, driving 11% boost in overall sales
  • Predicted customer demand with 92% accuracy, reducing stockouts by 13%
  • Performed A/B testing leading to 15% increase in conversion rates

### National Changhua University of Education - Research Assistant (Sept 2023 – Mar 2024)
- **Location**: Changhua, Taiwan
- **Key Achievements**:
  • Implemented dual-layer biometric authentication system with 30% accuracy improvement
  • Conducted statistical analysis resolving four major authentication failure causes
  • Architected Flask/Python solution for 1,200+ authentication records

## AWARDS & ACHIEVEMENTS
- **Won 1st Place – LionHacks 2025**: Led a team of 2 to victory designing AcademicNFT, a soul-bound NFT credentialing platform
- **Global Leaders Award (2024)**: Secured 25% scholarship for Master's in Data Science at George Washington University

## PROJECTS WITH LINKS

### Student Performance Indicator – AWS Cloud (Dec 2024)
- **Description**: Built an ML pipeline to predict student performance using academic and socio-economic data, achieving 87% accuracy. Automated deployment via AWS CodePipeline and Elastic Beanstalk.
- **Technologies**: Python, Flask, AWS Elastic Beanstalk, AWS CodePipeline, Machine Learning
- **GitHub**: https://github.com/itsamoghgr/mlproject_cloud_deployment

### Web Development Portfolio v3 (Sept 2025)
- **Description**: Built responsive portfolio website using modern web technologies with interactive animations and optimized performance.
- **Technologies**: React, Next.js, TypeScript, Material-UI, Responsive Design
- **GitHub**: https://github.com/itsamoghgr/portfolio
- **Live Demo**: https://amoghramagiri.com

### Credit Card Fraud Detection (May 2023)
- **Description**: Developed a credit card fraud detection model using supervised ML and ensemble methods achieving high accuracy with real-world data.
- **Technologies**: Python, Scikit-learn, Logistic Regression, SVM, Random Forest, Bagging, Boosting
- **GitHub**: https://github.com/itsamoghgr/credit_card_fraud_detection

### Fashion MNIST Classification (May 2023)
- **Description**: Built a CNN using TensorFlow to classify the Fashion-MNIST dataset from Zalando Research. Trained on 60k grayscale images, achieving efficient image recognition.
- **Technologies**: Python, TensorFlow, CNN, Fashion-MNIST, Image Recognition
- **GitHub**: https://github.com/itsamoghgr/fashion_mnist

### Car Price Prediction (Dec 2022)
- **Description**: Developed a machine learning model to predict car prices using features like year, mileage, and brand with hyperparameter tuning optimization.
- **Technologies**: Python, Scikit-learn, Random Forest, RandomizedSearchCV, EDA, Preprocessing
- **GitHub**: https://github.com/itsamoghgr/car-price-prediction

### NYC Taxi Fare Prediction (Apr 2023)
- **Description**: Built a regression model to predict NYC taxi fares using features like pickup/dropoff coordinates, time, and passenger count.
- **Technologies**: Python, Preprocessing, EDA, Scikit-learn, XGBoost, Random Forest, RandomizedSearchCV
- **GitHub**: https://github.com/itsamoghgr/nyc-taxi-fare-pred

### Leukemia Cancer Cell Classification (Apr 2023)
- **Description**: Researched and developed LDSVM (LR + DT + SVM) model for optimized prediction of Leukemia cancer cells using machine learning and deep learning techniques.
- **Technologies**: Python, TensorFlow, Scikit-learn, OpenCV, Medical Imaging
- **IEEE Publication**: https://ieeexplore.ieee.org/abstract/document/10099528

## CURRENT WORK-IN-PROGRESS PROJECTS

### Perance AI-Powered Personal Finance & Investment Management Platform
- **Description**: End-to-end personal finance web application enabling tracking of 4+ asset types and savings forecasts with 85% accuracy
- **Technologies**: React, Next.js, Supabase, OpenAI ChatGPT API
- **Key Features**:
  • Financial assistant interpreting user queries like 'What is a fixed deposit?'
  • Boosted financial tool engagement by 30% among younger users

### Credit Risk Analysis Dashboard - Fulton Bank
- **Description**: Advanced credit risk analysis system for forecasting mortgage loan applications
- **Technologies**: Python, SQL, Power BI, SSAS, Azure, Pandas, Scikit-learn
- **Status**: In progress at current role

### Energy Management System (Oct 2024)
- **Description**: Developed an interactive Streamlit app for analyzing university building energy data with ML models. Implemented Random Forest algorithms to identify consumption patterns.
- **Technologies**: Python, Streamlit, Random Forest, Folium, Pandas

### Customer Demand Prediction (Aug 2024)
- **Description**: Built machine learning models for predicting customer demand with 92% accuracy, leading to 13% reduction in stockouts across 10+ product categories.
- **Technologies**: Python, Scikit-learn, AWS S3, Machine Learning, Data Analysis

### Biometric Authentication System (Mar 2024)
- **Description**: Engineered dual-layer authentication system integrating DeepFace for facial recognition and MFCC features for voice recognition with 30% improved accuracy.
- **Technologies**: Python, DeepFace, MFCC, Flask, Computer Vision

## PORTFOLIO HIGHLIGHTS
- Currently pursuing MS in Data Science at George Washington University (graduating May 2026)
- Dual current roles: Data Scientist Intern at Fulton Bank + Consultant at DSSD
- Recent graduate from Presidency University with B.Tech in CS & Engineering (AI/ML specialization)
- Award winner: LionHacks 2025 champion and Global Leaders Award recipient
- Strong background in machine learning, cloud platforms (AWS/Azure), and financial technology
- International experience across USA, India, and Taiwan
- Expertise in GenAI, financial analytics, and sustainable energy research

## RESUME DOWNLOAD
Full detailed resume available for download at: /documents/amogh_ramagiri_resume_gen.pdf
`;

    return context.trim();
  } catch (error) {
    console.error('Error building resume context:', error);
    return `
# AMOGH G. RAMAGIRI - PROFESSIONAL PROFILE

I am a Data Scientist and Developer with expertise in machine learning, statistical analysis, and software development.
I specialize in turning complex data into actionable insights and building intelligent solutions.

Currently working as a Data Scientist Intern at Fulton Bank, focusing on credit risk assessment models and mortgage loan forecasting.

For detailed information about my experience, projects, and skills, please ask specific questions.
    `.trim();
  }
}