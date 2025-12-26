'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Radio, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trades', label: 'Trades', icon: TrendingUp },
  { href: '/signals', label: 'Signals', icon: Radio },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="relative z-20 glass-strong border-b border-neon-cyan/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Navigation Links */}
          <div className="flex items-center flex-1">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center mr-10 group">
              <Logo size={40} />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue group-hover:from-neon-purple group-hover:via-neon-pink group-hover:to-neon-cyan transition-all duration-300">
                  Oxy Algo
                </span>
                <span className="text-xs text-gray-500 -mt-1">Trading Platform</span>
              </div>
            </Link>

            {/* Navigation Items - Desktop */}
            <div className="hidden lg:flex lg:space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/50 shadow-neon-cyan'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-neon-cyan/30'
                    }`}
                  >
                    <Icon 
                      size={18} 
                      className={`mr-2 transition-all duration-300 ${
                        isActive ? 'text-neon-cyan' : 'text-gray-400 group-hover:text-neon-cyan'
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 animate-pulse -z-10"></div>
                    )}
                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Side - Sign Out & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Sign Out Button - Desktop */}
            <button
              onClick={handleSignOut}
              className="hidden sm:flex group relative inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white border border-transparent hover:border-red-500/50 hover:bg-red-900/20 transition-all duration-300 overflow-hidden"
            >
              <LogOut 
                size={18} 
                className="mr-2 text-gray-400 group-hover:text-red-400 transition-colors duration-300"
              />
              <span className="relative z-10">Sign Out</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-neon-cyan/30 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-neon-cyan" />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neon-cyan/20 animate-fade-in">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/50'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`mr-3 transition-all duration-300 ${
                        isActive ? 'text-neon-cyan' : 'text-gray-400 group-hover:text-neon-cyan'
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  handleSignOut()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-red-900/20 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/50"
              >
                <LogOut size={20} className="mr-3 text-gray-400" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
    </nav>
  )
}
