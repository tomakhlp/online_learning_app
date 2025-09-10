import {GLOBAL_TEXT} from "./global.ts";

export const PAGES_TEXT = {
    MY_ACCOUNT: {
        HEADER: GLOBAL_TEXT.COMMON.MY_ACCOUNT,
        TRAININGS: {
            HEADER: GLOBAL_TEXT.HEADING.MY_TRAININGS,
            DESCRIPTION: `The Training Section is interactive, allowing you to engage with trainers and fellow learners, 
                          participate in quizzes, and track your progress. All our courses are flexible and adaptable 
                          to your schedule and learning speed.`,
        },
        SECTIONS: {
            TRAINER: {
                HEADER: GLOBAL_TEXT.HEADING.MY_STUDENTS,
            },
            STUDENT: {
                HEADER: GLOBAL_TEXT.HEADING.MY_TRAINERS,
            },
            MY_PROFILE: {
                HEADER: 'My Profile',
                STATUS: GLOBAL_TEXT.COMMON.STATUS,
            },
            EDIT_PROFILE: {
                HEADER: 'Edit Profile',
                PHOTO: {
                    HEADER: 'Profile photo',
                    UPLOAD_LABEL: 'Upload your photo',
                    UPLOAD_INSTRUCTION: 'Your photo should be in PNG or JPG format',
                }
            },
        },
    },

    ADD_TRAINER: {
        HEADER: GLOBAL_TEXT.COMMON.ADD_TRAINER,
        INSTRUCTIONS: "Please select trainers for adding them into your trainers list",
        NO_REMOVAL_NOTE: "* - Trainers cannot be removed once added to your list.",
    },

    ADD_TRAINING: {
        HEADING: 'Add passed training',
    },

    CHANGE_PASSWORD: {
        HEADER: "Security",
        SUBHEADER: GLOBAL_TEXT.COMMON.CHANGE_PASSWORD,
        SUCCESS: {
            CONGRATS: 'Password changed',
            DESCRIPTION: 'Please proceed sign in with new password',
        }
    },

    BLOG: {
        HEADER: GLOBAL_TEXT.COMMON.BLOG,
    },

    HOME: {
        GREETING: {
            SIGNED_IN: "Hi, {{name}}!",
            SIGNED_OUT: "Let's start learning!",
        },
        WELCOME_MESSAGE: `Welcome to Learn Platform - where every day is a day to learn. Dive into the vast ocean of
                          knowledge and empower yourself with the tools for a successful tomorrow. Happy learning!`,
        WHATS_NEW: {
            HEADER: "What's new?",
            DESCRIPTION: `Explore fresh articles, in-depth tutorials, and the latest tech insights designed to keep
                          you ahead in your learning journey. Whether you're just starting out or sharpening your
                          skills, there's something new for everyone.`,
        },
        BANNER: {
            HEADER: GLOBAL_TEXT.COMMON.JOIN_US,
            DESCRIPTION: `Discover a vibrant community of learners and experts. Connect, share ideas, 
                          and grow your knowledge together with like-minded people from around the world`,
        },
    },

    JOIN_US: {
        HEADER: GLOBAL_TEXT.COMMON.JOIN_US,
        SECTIONS: {
            TITLE: "Register as {{role}}",
            TRAINER: {
                ROLE: 'Trainer',
                DESCRIPTION: "Join our platform and empower people through mentorship",
            },
            STUDENT: {
                ROLE: 'Student',
                DESCRIPTION: "Join our platform and gain access to educational resources",
            },
        },
    },

    LOGIN: {
        HEADER: GLOBAL_TEXT.COMMON.SIGN_IN,
        SUBHEADING: "Welcome back",
        OR_TEXT: "or",
        SIGN_UP_PROMPT: "Don’t have an account?",
    },

    NOT_FOUND: {
        HEADER: "404 - Page Not Found",
        DESCRIPTION: "Sorry, the page you're looking for doesn't exist or has been moved.",
        LINK_TEXT: "← Back to Homepage",
    },

    REGISTRATION: {
        HEADER: GLOBAL_TEXT.COMMON.REGISTRATION,
        SUCCESS: {
            CONGRATS: "Congratulations, you have successfully registered with Learn Platform! Here are your credentials that you can change in your account:",
            USERNAME_LABEL: "User name",
            PASSWORD_LABEL: "Password",
        },
    },

    ABOUT_US: {
        HEADER: GLOBAL_TEXT.COMMON.ABOUT_US,
        DESCRIPTION: `Welcome to the 'About Us' section of Learn Platform, where we aim to provide you with a deeper 
                understanding of our philosophy, values, and mission. Established in 2023, Learn Platform was born out 
                of a passion for learning and a belief in the power of knowledge to transform lives.`,
        TEAM: {
            HEADER: "Our Team",
            DESCRIPTION: `Meet the team behind our course platform, dedicated to providing high-quality learning 
                          experiences.`,
        },
    },

    FEATURES: {
        HEADER: GLOBAL_TEXT.COMMON.FEATURES,
        LEARNING: {
            HEADER: "Learning",
            DESCRIPTION: `Innovative tools and strategies that enhance learning, making it more effective, 
                          accessible, and engaging for everyone, regardless of their skill level.`,
        },
        SECTION_ONE: {
            HEADER: "Interactive Learning Tools",
            DESCRIPTION: `Engage with quizzes, simulations, and real-world exercises that encourage active 
                          participation and improve long-term retention through practice and feedback.`,
        },
        SECTION_TWO: {
            HEADER: "Personalized Learning Paths",
            DESCRIPTION: `Content adapts to your goals, pace, and progress — ensuring a more focused 
                          and effective learning experience tailored to individual needs.`,
        },
    },

    PRICING: {
        HEADER: GLOBAL_TEXT.COMMON.PRICING,
        DESCRIPTION: `At Learn Platform, we believe in providing high-quality education that's accessible 
                      and affordable. We offer diverse pricing plans designed to cater to individual learners, 
                      groups, and organizations. Let's explore each option below:`,
        FAQ: {
            HEADER: 'Frequently asked questions',
            DESCRIPTION: 'Find answers to the most common questions about our pricing, features, and support'
        },
    },

    TRAININGS: {
        HEADER: GLOBAL_TEXT.COMMON.TRAININGS,
        SEARCH_HEADER: "Search Trainings",
        TABLE_HEADER: {
            STUDENT: "My passed trainings",
            TRAINER: "Results",
        },
    },

    COMING_SOON: {
        HEADER: "🚧 Page in progress",
        DESCRIPTION: "We're working on this page and it will be available soon. Thanks for your patience!",
        LINK_TEXT: "← Back to Homepage",
    },
};
