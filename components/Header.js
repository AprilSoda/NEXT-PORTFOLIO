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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                transition={{ default: { duration: 2, ease: [0.19, 1, 0.22, 1], delay: router.pathname === '/' ? 0 : 0 } }}
            >
                <div className="logo">
                    <Button>
                        <Link href='/'>
                            <SVG_LOGO />
                        </Link>
                    </Button>
                </div>
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                    data-testid="mobile-menu-toggle"
                >
                    <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
                <ul className={`sub-menu-area ${mobileMenuOpen ? 'is-open' : ''}`}>
                    <li><Button><Link href="/works" data-testid="nav-works" onClick={() => setMobileMenuOpen(false)}>WORKS</Link></Button></li>
                    <li><Button><Link href="/blogs" data-testid="nav-blogs" onClick={() => setMobileMenuOpen(false)}>BLOG</Link></Button></li>
                    <li><Button><Link href="/about" data-testid="nav-about" onClick={() => setMobileMenuOpen(false)}>ABOUT</Link></Button></li>
                    <li><Button><Link href="/contact" data-testid="nav-contact" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link></Button></li>
                </ul>
            </motion.nav>
        </header>
    )
}

export default Header;

