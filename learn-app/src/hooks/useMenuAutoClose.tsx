import {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router";

export function useMenuAutoClose() {
    const [isOpen, setIsOpen] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const toggleOpen = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return { isOpen, toggleOpen, elementRef };
}
