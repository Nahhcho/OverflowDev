import ROUTES from '@/constants/routes'
import Link from 'next/link'
import React from 'react'
import { Avatar } from './ui/avatar'
import Image from 'next/image'

const UserAvatar = ({ id, name, imageUrl, className = 'h-9 w-9' }) => {
  return (
    <Link href={ROUTES.PROFILE(id)}>
        <Avatar className={className}>
            {imageUrl ? (
                <Image 
                    src={imageUrl}
                    alt={name}
                    className='object-cover'
                    width={36}
                    height={36}
                    quality={100}
                />
            ) : (
                <div className='w-full h-full bg-primary-500 rounded-full'/>
            )}
        </Avatar>
    </Link>
  )
}

export default UserAvatar