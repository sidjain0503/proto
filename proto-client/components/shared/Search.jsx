import { LucideSearch } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'

const Search = ({className, ...props}) => {
  return (
    <div className={cn("flex items-center gap-2 rounded-full border border-gray-200 px-4", className)}>
        <LucideSearch className="w-4 h-4" />
        <Input {...props} className="border-none shadow-none p-2 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"/>
    </div>
  )
}

export default Search