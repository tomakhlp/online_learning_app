import Logo from "../../ui/Logo/Logo.tsx";
import FooterLinks from "./components/FooterLinks.tsx";
import SubscribeSection from "./components/SubscribeSection.tsx";
import SocialLinks from "./components/SocialLinks.tsx";
import Copyright from "./components/Copyright.tsx";
import LanguageSwitcher from "../../common/LanguageSwitcher/LanguageSwitcher.tsx";
import {useNavLinks} from "../../../locales/useNavLinks.ts";

function Footer() {
    const NAV_LINKS = useNavLinks('footer');

    return (
        <footer className="bg-basic-100 p-6 md:px-24 mt-auto">
            <div className="flex flex-col gap-10 md:hidden items-center">
                {Object.entries(NAV_LINKS).map(([key, section]) => (
                    <FooterLinks key={key} label={section.label} links={section.links} />
                ))}

                <LanguageSwitcher/>
                <SocialLinks/>
                <SubscribeSection/>
                <Copyright/>
            </div>

            <div className="hidden md:flex md:flex-col gap-6 pt-10">
                <div className="flex flex-wrap justify-between items-start gap-8">
                    <Logo isLink={false}/>
                    {Object.entries(NAV_LINKS).map(([key, section]) => (
                        <FooterLinks key={key} label={section.label} links={section.links} />
                    ))}
                    <SubscribeSection/>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-6 border-t border-[var(--color-basic-300)] pt-4">
                    <LanguageSwitcher/>
                    <Copyright/>
                    <SocialLinks/>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
