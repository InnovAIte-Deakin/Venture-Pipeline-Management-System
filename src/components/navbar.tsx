'use client'
import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const educationLinks = [
  {
    title: 'Disability Lens Investing',
    href: '/education/disability-lens',
    description: 'Learn about investing through a disability inclusion perspective',
  },
  {
    title: 'Gender Lens Investing',
    href: '/education/gender-lens',
    description: 'Understand the importance of gender equity in investments',
  },
  {
    title: 'IRIS Metrics',
    href: '/education/iris-metrics',
    description: 'Explore impact measurement using IRIS+ metrics',
  },
  {
    title: 'Inclusive Business',
    href: '/education/inclusive-business',
    description: 'Best practices for building inclusive ventures',
  },
]

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* <Image
            src="/logo.png" // Add your logo image here
            alt="Venture Pipeline Logo"
            width={40}
            height={40}
          /> */}
          <span className="font-bold text-xl">VenturePipeline</span>
        </Link>

        {/* Navigation Menu */}
        <div className="flex items-center space-x-6 gap-14">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Education Hub</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[400px] p-1">
                    {educationLinks.map((link) => (
                      <ListItem key={link.title} title={link.title} href={link.href}>
                        {link.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Register Venture</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'

export default Navbar
