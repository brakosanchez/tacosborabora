'use client';

import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import Button from '@/components/ui/Button';

type Allergy = {
  id: string;
  name: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  allergies?: Allergy[];
};

type ProfileFormProps = {
  userData: UserProfile;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: 'male' | 'female' | 'other';
    allergies: string[];
  };
  availableAllergies: Allergy[];
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAllergyChange: (allergyId: string, isChecked: boolean) => void;
};

export default function ProfileForm({
  userData,
  formData,
  availableAllergies = [],
  isEditing,
  isLoading,
  onEdit,
  onCancel,
  onSubmit,
  onChange,
  onAllergyChange,
}: ProfileFormProps) {
  return (
    <div className="bg-transparent border-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">Información Personal</h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors border border-yellow-500/30"
          >
            <FiEdit2 className="mr-2 h-4 w-4" />
            Editar
          </button>
        ) : (
          <div className="space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-3 py-1.5 text-sm text-yellow-200/80 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-md transition-colors"
            >
              <FiX className="mr-1 h-4 w-4" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-[#1a120b] bg-yellow-500 hover:bg-yellow-400 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Guardando...'
              ) : (
                <>
                  <FiSave className="mr-2 h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Sección 1: Información Básica */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-yellow-400">Información Básica</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-yellow-400/90 mb-1">
                  Nombre completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    className="w-full bg-[#2a1e17] border border-yellow-500/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    disabled={!isEditing}
                  />
                ) : (
                  <p className="text-yellow-200 mt-1">{userData.name}</p>
                )}
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="gender" className="block text-sm font-medium text-yellow-400/90 mb-1">
                  Género
                </label>
                {isEditing ? (
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || 'other'}
                    onChange={onChange as any}
                    className="w-full bg-[#2a1e17] border border-yellow-500/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    disabled={!isEditing}
                  >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Prefiero no decirlo</option>
                  </select>
                ) : (
                  <p className="text-yellow-200 mt-1">
                    {formData.gender === 'male' ? 'Masculino' : 
                     formData.gender === 'female' ? 'Femenino' : 'Prefiero no decirlo'}
                  </p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-yellow-400/90 mb-1">
                  Correo electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={onChange}
                    className="block w-full bg-[#2a1e17] border border-yellow-500/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-yellow-200 mt-1">{userData.email}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-yellow-400/90 mb-1">
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={onChange}
                    className="block w-full bg-[#2a1e17] border border-yellow-500/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-yellow-200 mt-1">{userData.phone || 'No especificado'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 2: Dirección */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-yellow-400 mt-8">Dirección</h3>
            <div className="sm:col-span-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-yellow-400/90 mb-1">
                      Dirección completa
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      rows={3}
                      value={formData.address}
                      onChange={onChange}
                      className="block w-full bg-[#2a1e17] border border-yellow-500/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      disabled={isLoading}
                      placeholder="Calle, número, colonia, código postal, ciudad, estado"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-yellow-400/90 mb-1">Dirección</p>
                  <p className="text-yellow-200 whitespace-pre-line">
                    {userData.address || 'No especificada'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sección 3: Alergias */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-yellow-400 mt-8">Alergias Alimentarias</h3>
            {isEditing ? (
              <div className="space-y-3">
                <p className="text-sm text-yellow-200/80">
                  Selecciona las alergias que tengas para que podamos adaptar nuestros platillos a tus necesidades.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availableAllergies.map((allergy) => (
                    <div key={allergy.id} className="flex items-center">
                      <input
                        id={`allergy-${allergy.id}`}
                        name="allergies"
                        type="checkbox"
                        checked={(formData.allergies || []).includes(allergy.id)}
                        onChange={(e) => onAllergyChange(allergy.id, e.target.checked)}
                        className="h-4 w-4 text-yellow-500 border-yellow-400/50 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor={`allergy-${allergy.id}`} className="ml-2 block text-sm text-yellow-200">
                        {allergy.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {userData.allergies?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.allergies.map((allergy) => (
                      <span 
                        key={allergy.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                      >
                        {allergy.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-yellow-200/70">No se han especificado alergias</p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
