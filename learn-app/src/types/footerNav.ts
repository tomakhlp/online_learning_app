export type FooterLink = {
    title: string;
    to: string;
};

export type FooterSection = {
    label: string;
    links: FooterLink[];
};

export type FooterNavLinks = {
    product: FooterSection;
    resources: FooterSection;
    company: FooterSection;
};
