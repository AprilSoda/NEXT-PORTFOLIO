import React, { useEffect, useState } from 'react'
import SVG_LOGO from '../public/SVG_LOGO.svg'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Button from './Button'

const Header = ({ workcount }) => {
    const router = useRouter()
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                const currentScrollPos = window.pageYOffset;
                const isVisible = prevScrollPos > currentScrollPos || currentScrollPos <= 100;

                setPrevScrollPos(currentScrollPos);
                setVisible(isVisible);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [prevScrollPos]);

    return (
        <header className={`header-comp ${visible ? 'visible' : 'hidden'}`} id='header-comp'>
            <motion.nav
                className="header-inner"
                initial={{ opacity: 0, translateY: '15vh' }}
                animate={{ opacity: 1, translateY: '0vh' }}
                transition={{ default: { duration: 2, ease: [0.19, 1, 0.22, 1], delay: router.pathname === '/' ? 5.3 : 0 } }}
            >
                <div className="logo">
                    <Button>
                        <Link href='/' ><a> <SVG_LOGO /> </a></Link>
                    </Button>
                </div>
                <ul className="sub-menu-area">
                    <li><Button><Link href="/works"><a> WORKS </a></Link></Button></li>
                    <li><Button><Link href="/blogs"><a> BLOG </a></Link></Button></li>
                    <li><Button><Link href="/about"><a> ABOUT </a></Link></Button></li>
                    <li><Button><Link href="/contact"><a> CONTACT </a></Link></Button></li>
                </ul>
            </motion.nav>
        </header>
    )
}

export default Header;

