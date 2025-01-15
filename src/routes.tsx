import { IconType } from 'react-icons'
import { TbBriefcase2, TbCircleCheck, TbCircleX, TbDotsCircleHorizontal } from 'react-icons/tb'

export type ValidRoutePath = '/' | 'pending' | 'accepted' | 'rejected'

export type RouteDescriptor = {
    path: ValidRoutePath
    name: string
    icon: IconType
}

export const ROUTES: RouteDescriptor[] = [
    { path: '/', name: 'All Cases', icon: TbBriefcase2 },
    { path: 'pending', name: 'Pending Cases', icon: TbDotsCircleHorizontal },
    { path: 'accepted', name: 'Accepted Cases', icon: TbCircleCheck },
    { path: 'rejected', name: 'Rejected Cases', icon: TbCircleX }
]