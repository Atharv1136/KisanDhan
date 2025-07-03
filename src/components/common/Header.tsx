import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tractor, Menu, X, Globe, User, LogOut, Brain } from 'lucide-react';

interface HeaderProps {
  userType: string | null;
  onUserTypeChange: (type: string) => void;
}

const Header: React.FC<HeaderProps> = ({ userType, onUserTypeChange }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
    setIsUserMenuOpen(false);
  };
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsLanguageMenuOpen(false);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  const switchUserType = () => {
    const newType = userType === 'farmer' ? 'shopkeeper' : 'farmer';
    onUserTypeChange(newType);
  };

  const farmerLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/ai-assistant', label: 'AI Assistant', icon: Brain },
    { to: '/price-comparison', label: t('nav.price_comparison') },
    { to: '/msp-information', label: t('nav.msp_information') },
    { to: '/procurement-centers', label: t('nav.procurement_centers') },
    { to: '/selling-deadlines', label: t('nav.selling_deadlines') }
  ];

  const shopkeeperLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/ai-assistant', label: 'AI Assistant', icon: Brain },
    { to: '/shopkeeper', label: t('shopkeeper.dashboard.title') },
    { to: '/shopkeeper/add-shop', label: t('shopkeeper.add_shop.title') },
    { to: '/shopkeeper/manage-crops', label: t('shopkeeper.manage_crops.title') }
  ];

  const navLinks = userType === 'shopkeeper' ? shopkeeperLinks : farmerLinks;

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Tractor size={32} className="text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold">{t('app_name')}</h1>
              <p className="text-xs text-green-200">{t('tagline')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:text-yellow-300 transition-colors flex items-center ${
                  location.pathname === link.to ? 'text-yellow-300 font-semibold' : ''
                }`}
              >
                {link.icon && <link.icon size={16} className="mr-1" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-1 hover:text-yellow-300 transition-colors"
              >
                <Globe size={20} />
                <span>{i18n.language.toUpperCase()}</span>
              </button>
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {t('language.en')}
                  </button>
                  <button
                    onClick={() => changeLanguage('hi')}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {t('language.hi')}
                  </button>
                  <button
                    onClick={() => changeLanguage('mr')}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {t('language.mr')}
                  </button>
                </div>
              )}
            </div>

            {/* User Type Switch */}
            <button
              onClick={switchUserType}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm font-medium transition-colors"
            >
              {userType === 'farmer'
                ? t('user_type.switch_to', { type: t('user_type.shopkeeper') })
                : t('user_type.switch_to', { type: t('user_type.farmer') })}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-1 hover:text-yellow-300 transition-colors"
              >
                <User size={20} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {t('nav.account')}
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`hover:text-yellow-300 transition-colors flex items-center ${
                    location.pathname === link.to ? 'text-yellow-300 font-semibold' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon && <link.icon size={16} className="mr-2" />}
                  {link.label}
                </Link>
              ))}
              <Link
                to="/account"
                className="hover:text-yellow-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.account')}
              </Link>
              <div className="pt-2 border-t border-green-600">
                <div className="flex space-x-4 items-center">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`px-2 py-1 rounded ${
                      i18n.language === 'en' ? 'bg-green-600' : 'hover:bg-green-600'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => changeLanguage('hi')}
                    className={`px-2 py-1 rounded ${
                      i18n.language === 'hi' ? 'bg-green-600' : 'hover:bg-green-600'
                    }`}
                  >
                    HI
                  </button>
                  <button
                    onClick={() => changeLanguage('mr')}
                    className={`px-2 py-1 rounded ${
                      i18n.language === 'mr' ? 'bg-green-600' : 'hover:bg-green-600'
                    }`}
                  >
                    MR
                  </button>
                </div>
              </div>
              <button
                onClick={switchUserType}
                className="mt-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm font-medium transition-colors self-start"
              >
                {userType === 'farmer'
                  ? t('user_type.switch_to', { type: t('user_type.shopkeeper') })
                  : t('user_type.switch_to', { type: t('user_type.farmer') })}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;