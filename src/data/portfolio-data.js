export const personalInfo = {
    name: "Ayush Chauhan",
    location: "Chandigarh, IN",
    email: "mail@ayuch.dev",
    phone: "+91-84485-22434",
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

// Update your projects array to include thumbnails and URLs
export const projects = [
    {
        title: "Gitx",
        description: "TUI git helper with interactive features",
        // thumbnail: "gitx_thmb.png", // image path
        url: "https://github.com/gitxtui/gitx", // GitHub or project URL
        repoUrl: "https://github.com/gitxtui/gitx", // Repository URL 
        // demoUrl: "https://demo.netlify.app", // Demo URL (optional)
        tech: ["Python", "Textual", "GitPython", "MkDocs", "GH Actions"],
        details: [
            "A powerful Terminal User Interface (TUI) for Git that makes version control more accessible and efficient."
        ]
    },
    {
        title: "SadakAI",
        description: "AI platform for personalized learning paths",
        url: "https://github.com/Open-Source-Chandigarh/sadakAI",
        repoUrl: "https://github.com/Open-Source-Chandigarh/sadakAI",
        // demoUrl: "https://demo.netlify.app", // Demo URL (optional)
        tech: ["Python", "Flask", "LangChain", "Docker", "Groq", "Qdrant"],
        details: [
            "sadakAI is an AI-Powered roadmap generator that tailors career growth plans for aspiring and experienced software developer."
        ]
    }
];

export const contributions = [
    {
        project: "Graphite",
        description: "A 2D vector graphics editor",
        contribution: "Fixed minor bugs related to the path tool, extended functionality of the path tool such as angle locking and snapping to grid",
        url: "https://github.com/GraphiteEditor/Graphite"
    },
    {
        project: "DevrAI",
        description: "An AI-powered dev-rel assistant",
        contribution: "Collaborated with implementing the base architecture of the project",
        url: "https://github.com/devrel-ai"
    },
    {
        project: "Pictopy",
        description: "An Image sorter that sorts photos based on face encodings",
        contribution: "Added a feature to sort images based on an input taken from the user, uploaded or captured live through the webcam using OpenCV",
        url: "https://github.com/bakayu/pictopy"
    }
];

export const skills = {
    languages: ["Python", "Rust", "Go", "C", "SQL (Postgres)", "JavaScript", "HTML/CSS"],
    frameworks: ["React", "Node.js", "Flask", "Django", "FastAPI", "LangChain", "MkDocs"],
    tools: ["Git", "GH Actions", "Docker", "Azure", "VS Code", "NeoVim", "Linux CLI"]
};

export const accomplishments = [
    {
        title: "Awarded as Top Performer of the Batch",
        organization: "Chitkara University Rajpura, Punjab",
        date: "Apr. 2025",
        details: "Secured a CGPA of 9.6 in the previous semester"
    }
];