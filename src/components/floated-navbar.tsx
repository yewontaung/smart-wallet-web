import { BellIcon, BotIcon, SettingsIcon, UserIcon, Users2Icon, WalletIcon } from "lucide-react"
import { iconSize } from "../utils/constants"
import type { ReactNode } from "react"
import { Link, NavLink } from "react-router-dom"

export function FloatedTopNavbar() {
    return (
        <div className="fixed md:right-3/12 inset-e-3.5 top-3 gap-3 z-10 rounded-full p-1.5 border border-white/20 backdrop-blur-2xl">
            <div className="flex sticky">
                <Link to="" className="rounded-full hover:bg-black/30 p-2">
                    <UserIcon size={iconSize} />
                </Link>
                <Link to="" className="rounded-full hover:bg-black/30 p-2">
                    <BellIcon size={iconSize} />
                </Link>
            </div>
        </div>
    )
}

export function FloatedBottomNavbar() {
    return (
        <div className="left-1/2 -translate-x-1/2 rounded-full p-1.5 border border-white/20 fixed backdrop-blur-2xl bottom-8">
            <div className="flex items-center">
                <NavItem end icon={<WalletIcon size={iconSize} />} label="Wallet" link="/wallet"/>
                <NavItem icon={<BotIcon size={iconSize} />} label="Agent" link="/wallet/agent" />
                <NavItem icon={<Users2Icon size={iconSize} />} label="Contact" link="/wallet/contact" />
                <NavItem icon={<SettingsIcon size={iconSize} />} label="Setting" link="/wallet/setting" />
            </div>
        </div>
    )
}

function NavItem({icon, label, link, end = false}:{icon:ReactNode, label:string, link:string, end?:boolean}) {
    return (
        <NavLink end={end} to={link} className={({isActive}) => `p-1 px-2 cursor-pointer w-20 rounded-full flex justify-center items-center flex-col ${isActive ? 'bg-blue-500/30 text-blue-500' : 'hover:bg-black/10 '}`}>
            {icon}
            <small>{label}</small>
        </NavLink>
    )
}