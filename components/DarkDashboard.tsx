Replace your entire lucide-react import block with this:

```tsx
import {
  Bell,
  CalendarDays,
  CalendarRange,
  Camera,
  CheckCircle2,
  Crown,
  Droplets,
  ExternalLink,
  FileText,
  Globe,
  Globe2,
  Home,
  ImagePlus,
  LineChart,
  Link as LinkIcon,
  MessageCircle,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  BriefcaseBusiness,
  Target,
  TrendingUp,
  UserRound,
  X,
  ClipboardList,
  Share2,
  Eye,
  Megaphone,
} from "lucide-react";
```

Then find this:

```tsx
const socials = [
  { platform: "Instagram", handle: "@locsbystephb", url: "instagram.com/locsbystephb", icon: Instagram, posts: 18, views: "12.4K" },
  { platform: "Facebook", handle: "Locs by Steph B", url: "facebook.com/locsbystephb", icon: Facebook, posts: 9, views: "4.8K" },
  { platform: "Booking", handle: "Book Appointment", url: "glossgenius.com/locsbystephb", icon: CalendarDays, posts: 0, views: "1.7K" },
];
```

Replace it with:

```tsx
const socials = [
  {
    platform: "Instagram",
    handle: "@locsbystephb",
    url: "instagram.com/locsbystephb",
    icon: Globe,
    posts: 18,
    views: "12.4K",
  },
  {
    platform: "Facebook",
    handle: "Locs by Steph B",
    url: "facebook.com/locsbystephb",
    icon: Globe2,
    posts: 9,
    views: "4.8K",
  },
  {
    platform: "Booking",
    handle: "Book Appointment",
    url: "glossgenius.com/locsbystephb",
    icon: CalendarDays,
    posts: 0,
    views: "1.7K",
  },
];
```
