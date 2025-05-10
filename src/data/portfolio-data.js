export const personalInfo = {
    name: "Ayush Chauhan",
    location: "Chandigarh, IN",
    email: "mail@ayuch.dev",
    phone: "+91 8448522434",
    links: {
        linkedin: "linkedin.com/in/bakayu",
        github: "github.com/bakayu",
    }
};

export const education = [
    {
        institution: "Chitkara University Rajpura, Punjab",
        degree: "Bachelor of Engineering in Computer Science and Engineering",
        duration: "Aug. 2024 – Present",
        details: "CGPA: 9.6"
    },
    {
        institution: "DAV Model School Shalimar Bagh, Delhi",
        degree: "Central Board of Secondary Education, Grade 11 and 12",
        duration: "July 2021 – Apr. 2023",
    }
];

export const experience = [
    {
        role: "Open Source Team Member",
        company: "Open Source Chandigarh",
        location: "Chitkara University Rajpura, Punjab",
        duration: "Sep. 2024 – Present",
        achievements: [
            "Collaborated with the Open Source Chandigarh team to promote open source software and contribute to various projects during Hacktoberfest 2024",
            "Collaborated with the Open Source Chandigarh team to conduct a workshop on Git and GitHub for students",
            "Participated in the GitHub Innovation Rally, where we encouraged the first year students of our campus to explore open source and activate their GitHub student accounts",
            "Onboarded 100+ students to GitHub and open source, helping them create their first pull requests",
            "Collaborated in organizing the TechAbhivyakti 3.0 Hackathon, A two day long hackathon where students showcased their frontend skills and created amazing projects"
        ]
    }
];

export const projects = [
    {
        title: "Gitx",
        duration: "Mar. 2025 – Present",
        tech: ["Python", "Textual", "GitPython", "MkDocs", "GH Actions"],
        description: "TUI git helper with interactive features",
        details: [
            "Developed a TUI git helper with Textual to help users understand git commands and use git in a more interactive way, via the terminal",
            "Implemented GitPython APIs to interact with git repositories and perform various git operations",
            "Used MkDocs to create a documentation website for the git helper",
            "Used GitHub Actions to automate the deployment of the documentation website, build and publish the TUI application"
        ]
    },
    {
        title: "SadakAI",
        duration: "Sep. 2024 – Feb 2025",
        tech: ["Python", "Flask", "LangChain", "Docker", "Groq", "Qdrant"],
        description: "AI platform for personalized learning paths",
        details: [
            "Developed an AI platform to help users find the best route to learn a new skill, using LangChain and Groq",
            "Implemented a Flask API to interact with the AI platform and provide a user interface",
            "Used Docker to containerize the application and deploy it on a cloud server",
            "Used LangChain, Groq and Qdrant to create a retrieval augmented generation (RAG) system to provide personalized learning paths for users"
        ]
    }
];

export const contributions = [
    {
        project: "Graphite",
        description: "A 2D vector graphics editor",
        contribution: "Fixed minor bugs related to the path tool, extended functionality of the path tool such as angle locking and snapping to grid"
    },
    {
        project: "DevrAI",
        description: "An AI-powered dev-rel assistant",
        contribution: "Collaborated with implementing the base architecture of the project"
    },
    {
        project: "Pictopy",
        description: "An Image sorter that sorts photos based on face encodings",
        contribution: "Added a feature to sort images based on an input taken from the user, uploaded or captured live through the webcam using OpenCV"
    }
];

export const skills = {
    languages: ["Python", "C", "SQL (Postgres)", "JavaScript", "HTML/CSS", "Go", "Rust"],
    frameworks: ["React", "Node.js", "Flask", "Django", "FastAPI", "Textual", "LangChain", "MkDocs"],
    tools: ["Git", "GitHub Actions", "Docker", "Azure", "VS Code", "NeoVim", "Linux CLI"]
};

export const accomplishments = [
    {
        title: "Awarded as Top Performer of the Batch",
        organization: "Chitkara University Rajpura, Punjab",
        date: "Apr. 2025",
        details: "Secured a CGPA of 9.6 in the previous semester"
    }
];