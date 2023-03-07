type FooterProps = {
    clicked: boolean
}

const Footer: React.FC<FooterProps> = ({clicked}) => {

    return(
        <footer className="bg-indigo-500 h-24 absolute bottom-0 w-full">
            {clicked ? "clicked" : "not clicked"}
        </footer>
    )
}

export default Footer;