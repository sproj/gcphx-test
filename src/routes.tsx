import { IconType } from 'react-icons'
import { TbBriefcase2, TbCircleCheck, TbCircleX, TbDotsCircleHorizontal } from 'react-icons/tb'

export type ValidRoutePath = '/' | 'pending' | 'accepted' | 'rejected'

export type RouteDescriptor = {
    path: ValidRoutePath
    name: string
    icon: IconType
}

export const ROUTES: RouteDescriptor[] = [
    { path: '/', name: 'All cases', icon: TbBriefcase2 },
    { path: 'pending', name: 'Pending cases', icon: TbDotsCircleHorizontal },
    { path: 'accepted', name: 'Accepted cases', icon: TbCircleCheck },
    { path: 'rejected', name: 'Rejected cases', icon: TbCircleX }
]
