import {Link} from "react-router";
import {FooterSection} from "../../../../types/footerNav.ts";

type FooterLinksProps = FooterSection;

function FooterLinks({ label, links }: FooterLinksProps) {
    return (
        <div className="w-full md:w-auto text-center md:text-start">
            <h4 className="font-bold mb-2">{label}</h4>
            <ul className="space-y-1">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link to={link.to}>{link.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FooterLinks;
