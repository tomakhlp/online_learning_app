import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function SocialLinks() {
    return (
        <div className="flex gap-5 justify-center self-center">
            <a href="#"><FaFacebook className="w-6 h-6 text-primary-100" /></a>
            <a href="#"><FaTwitter className="w-6 h-6 text-primary-100" /></a>
            <a href="#"><FaInstagram className="w-6 h-6 text-primary-100" /></a>
        </div>
    );
}

export default SocialLinks;
