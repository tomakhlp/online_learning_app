import {Link} from "react-router";

export interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps{
    items: BreadcrumbItem[];
}

function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center">
            {items.map((item, index) => (
                <span key={index} className="flex items-center">
                    {item.path ? (
                        <Link to={item.path} className="text-primary-100 hover:underline text-sm">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-sm">{item.label}</span>
                    )}
                    {index < items.length - 1 && (
                        <span className="mx-2">{'>'}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

export default Breadcrumbs;
