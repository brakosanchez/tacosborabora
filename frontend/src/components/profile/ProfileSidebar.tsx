'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiHelpCircle } from 'react-icons/fi';

type ProfileSidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
  userGender?: 'male' | 'female' | 'other';
};

const navigation = [
  { name: 'Mi Perfil', icon: FiUser, tab: 'profile' },
  { name: 'Mis Pedidos', icon: FiPackage, tab: 'orders' },
  { name: 'Direcciones', icon: FiMapPin, tab: 'addresses' },
];

export default function ProfileSidebar({ 
  activeTab, 
  onTabChange, 
  onSignOut, 
  userGender = 'other' 
}: ProfileSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Determinar la ruta del avatar basado en el género
  const getAvatarPath = (gender = userGender) => {
    try {
      // Si no hay género definido o es 'other', usar el avatar por defecto
      if (!gender || gender === 'other') {
        return '/avatardefault.png';
      }
      
      // Usar el avatar correspondiente al género
      return gender === 'male' ? '/avatarmasculino.png' : '/avatarfem.png';
    } catch (error) {
      console.error('Error al cargar el avatar:', error);
      return '/avatardefault.png';
    }
  };

  // Manejar errores de carga de imagen
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Si ya estamos intentando cargar el avatar por defecto, no hacemos nada más
    if (target.src.endsWith('/avatardefault.png')) {
      return;
    }
    // Intentar cargar el avatar por defecto
    target.src = '/avatardefault.png';
  };

  return (
    <div className="h-full p-4">
      <div className="mb-8 text-center">
        <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-yellow-500/30 bg-yellow-900/20">
          <img 
            src={getAvatarPath()}
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <h2 className="text-lg text-yellow-400">
          {session?.user?.name || 'Usuario'}
        </h2>
      </div>
      
      <nav className="space-y-1 mb-8">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => onTabChange(item.tab)}
            className={`flex items-center w-full px-3 py-2.5 text-sm rounded-md transition-colors ${
              activeTab === item.tab 
                ? 'text-yellow-400 bg-yellow-500/10' 
                : 'text-yellow-200/80 hover:bg-yellow-500/5 hover:text-yellow-400'
            }`}
          >
            <item.icon className="mr-3" size={18} />
            {item.name}
          </button>
        ))}
        
        <button
          onClick={onSignOut}
          className="flex items-center w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors mt-6"
        >
          <FiLogOut className="mr-3" size={18} />
          Cerrar sesión
        </button>
      </nav>
      
      <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
        <div className="flex items-center text-yellow-400 mb-2">
          <FiHelpCircle className="mr-2" />
          <span className="text-sm font-medium">¿Necesitas ayuda?</span>
        </div>
        <p className="text-xs text-yellow-200/60 mb-3">
          Estamos aquí para ayudarte con cualquier pregunta o problema que tengas.
        </p>
        <div className="space-y-1.5">
          <a href="tel:554955305" className="flex items-center text-xs text-yellow-200/80 hover:text-yellow-400 transition-colors">
            <span className="inline-block w-5">📞</span> 55 4955 305
          </a>
          <a 
            href="mailto:soporte@tacosborabora.com" 
            className="flex items-start text-xs text-yellow-200/80 hover:text-yellow-400 transition-colors break-words"
          >
            <span className="inline-block w-5 flex-shrink-0">✉️</span>
            <span className="flex-1 break-all">soporte@tacosborabora.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}
