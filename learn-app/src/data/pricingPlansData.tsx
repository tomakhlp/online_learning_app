import {MdOutlineEmail} from "react-icons/md";

export const pricingPlansData = [
    {
        title: "pricing:GROUP.TITLE",
        description: "pricing:GROUP.DESCRIPTION",
        price: "$50",
        frequency: "pricing:GROUP.FREQUENCY",
        features: [
            { text: "pricing:GROUP.FEATURES.USERS", included: true },
            { text: "pricing:GROUP.FEATURES.COLLABORATION", included: true },
            { text: "pricing:GROUP.FEATURES.ANALYTICS", included: false },
            { text: "pricing:GROUP.FEATURES.TRIAL", included: false },
        ],
        buttonText: "pricing:GROUP.BUTTON.UPGRADE",
        isHighlighted: false,
    },
    {
        title: "pricing:PERSONAL.TITLE",
        description: "pricing:PERSONAL.DESCRIPTION",
        price: "$100",
        frequency: "pricing:PERSONAL.FREQUENCY",
        badge: "pricing:PERSONAL.BADGE",
        features: [
            { text: "pricing:PERSONAL.FEATURES.USERS", included: true },
            { text: "pricing:PERSONAL.FEATURES.COLLABORATION", included: true },
            { text: "pricing:PERSONAL.FEATURES.ANALYTICS", included: true },
            { text: "pricing:PERSONAL.FEATURES.TRIAL", included: true },
        ],
        buttonText: "pricing:PERSONAL.BUTTON.UPGRADE",
        isHighlighted: true,
    },
    {
        title: "pricing:ORGANIZATION.TITLE",
        description: "pricing:ORGANIZATION.DESCRIPTION",
        price: "$150",
        frequency: "pricing:ORGANIZATION.FREQUENCY",
        features: [
            { text: "pricing:ORGANIZATION.FEATURES.USERS", included: true },
            { text: "pricing:ORGANIZATION.FEATURES.COLLABORATION", included: true },
            { text: "pricing:ORGANIZATION.FEATURES.ANALYTICS", included: true },
            { text: "pricing:ORGANIZATION.FEATURES.TRIAL", included: true },
        ],
        buttonText: "pricing:ORGANIZATION.BUTTON.CONTACT",
        buttonIcon: <MdOutlineEmail />,
        isHighlighted: false,
    },
];
