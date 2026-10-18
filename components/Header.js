import React, { useEffect, useState } from 'react'
import SVG_LOGO from '../public/SVG_LOGO.svg'
import Link from 'next/link'

// Next's locale detection sends Korean browsers on "/" to "/ko"; the NEXT_LOCALE
// cookie overrides it, so an explicit switch to English sticks.
const rememberLocale = (locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`
}
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Button from './Button'
import { useT } from '../lib/i18n'

const NAV = [
    { href: '/works', key: 'nav.work', testId: 'nav-works' },
    { href: '/journal', key: 'nav.journal', testId: 'nav-journal' },
    { href: '/about', key: 'nav.about', testId: 'nav-about' },
    { href: '/contact', key: 'nav.contact', testId: 'nav-contact' },
]

const Header = ({ workcount }) => {
    const router = useRouter()
    const { t, locale } = useT()
    const otherLocale = locale === 'ko' ? 'en' : 'ko'
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
                        <Link href='/' aria-label="Kim Tae Kyun — home">
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
                    {NAV.map(({ href, key, testId }) => (
                        <li key={href}><Button><Link href={href} data-testid={testId} className={router.pathname.startsWith(href) ? 'active' : undefined} onClick={() => setMobileMenuOpen(false)}>{t(key)}</Link></Button></li>
                    ))}
                    <li className="lang-switch"><Button><Link href={router.asPath.split(/[?#]/)[0]} locale={otherLocale} lang={otherLocale} data-testid="lang-switch" onClick={() => { rememberLocale(otherLocale); setMobileMenuOpen(false) }}>{t('lang.switch')}</Link></Button></li>
                </ul>
            </motion.nav>
        </header>
    )
}

export default Header;

