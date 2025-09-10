import {ReactNode} from "react";
import Spinner from "../Spinner/Spinner.tsx";
import clsx from "clsx";

interface LoaderOverlayProps {
    isLoading: boolean;
    children: ReactNode;
    hideContent?: boolean;
    style?: string;
}

function LoaderOverlay({ isLoading, children, hideContent = false, style }: LoaderOverlayProps) {
    return (
        <div className={clsx("relative w-full h-full", style)}>
            {isLoading && <Spinner />}

            {!hideContent || !isLoading ? children : null}
        </div>
    )
}

export default LoaderOverlay;
