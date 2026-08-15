import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { iconSize } from "../../utils/constants";

export function BackButton({ onClick }: { onClick?: () => void }) {
    return (
        <>
            {onClick ? (
                <button onClick={onClick} className="border flex justify-center items-center rounded-full absolute top-0 inset-s-0 border-white/10 p-2 backdrop-blur-2xl">
                    <ArrowLeftIcon size={iconSize} />
                </button>
            ) : (
                <Link to={"/wallet"} className="border flex justify-center items-center rounded-full absolute top-0 start-0 border-white/10 p-2 backdrop-blur-2xl">
                    <ArrowLeftIcon size={iconSize} />
                </Link>
            )}
        </>
    )
}