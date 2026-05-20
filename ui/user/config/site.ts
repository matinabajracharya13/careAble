import { Award, Briefcase, GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

export const SITE_CONFIG = {
  name: 'CareAble',
  title: 'CareAble – Every Carer Deserves to be seen',
  description:
    "A platform recognising the skills of Australia's hidden caregiving workforce and connecting them to the support and opportunities they deserve.",
  keywords: ['self', 'assessment', 'certificate'],
  url: 'https://careable.com',
  contactUS: [
    { icon: Mail, text: 'hello@CareAble.dev' },
    { icon: Phone, text: '+61 2 0000 0000' },
    { icon: MapPin, text: 'Sydney, NSW, Australia' }
  ],
  roles: [
    { icon: GraduationCap, label: 'For Carers', desc: 'Prove your skills, earn certificates, land jobs' },
    { icon: Briefcase, label: 'For Carer Seekers', desc: 'Hire with confidence using verified assessments' },
    { icon: Award, label: 'Recognised Skilled Categories', desc: '85+ assessments across tech, management & more' }
  ]
};

export const APP_PERKS = ['Free skill assessments', 'Verified certificates', 'Trusted by 340+ companies', 'No credit card required'];
