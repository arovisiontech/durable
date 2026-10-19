import { PublicFooterData } from '@/src/types/public'

export const DEFAULT_FOOTER_DATA: PublicFooterData = {
  bannerSubtitle: 'BUILDING YOUR VISION',
  bannerTitle: "LET'S BUILD SOMETHING AMAZING.",
  bannerButtonText: "LET'S DISCUSS",
  bannerButtonLink: '/contact',

  logoUrl: '/logo.svg',
  newsletterTitle: 'SIGN UP FOR NEWSLETTER',
  newsletterPlaceholder: 'your email.....',
  newsletterButtonText: 'SUBSCRIBE',

  locationTitle: 'OUR LOCATIONS',
  addressLine1: 'Noal More, Roras Road P.O. Box 919',
  addressLine2: 'Sialkot - 51310 Pakistan.',
  mapUrl: 'https://maps.app.goo.gl/RGr1xeaZjtdHgCpX8',
  phone1: '(+92) 52 3563200',
  phone2: '(+92) 52 3553777 | (+92) 523252500',
  email: 'info@durablehs.com',

  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    pinterest: 'https://pinterest.com',
  },

  quickLinksTitle: 'QUICK LINKS',
  quickLinks: [
    { label: 'Catalogues', href: '/catalogues' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Strengths', href: '/strengths' },
    { label: 'History', href: '/history' },
    { label: 'CSR', href: '/csr' },
    { label: 'Compliance', href: '/compliance' },
    { label: 'News', href: '/news' },
    { label: 'Quality', href: '/quality' },
  ],

  productRangeTitle: 'PRODUCT RANGE',
  productRangeLinks: [
    { label: 'General Surgery', href: '/category/general-surgery' },
    { label: 'Dental Instruments', href: '/category/dental' },
    { label: 'Diagnostics Instruments', href: '/category/general-surgery' },
    { label: 'Hollowware', href: '/category/medical-hollowware' },
    { label: 'Hospital Furniture', href: '/category/hospital-furniture' },
    { label: 'Laparoscopy & Single Use', href: '/category/single-use-instruments', isHighlight: true },
  ],

  copyrightText: '© 2026 Durable Hospital Supplies All Rights Reserved',
  designedByText: 'Brandie Design Agency',
  designedByLink: '#',
}
