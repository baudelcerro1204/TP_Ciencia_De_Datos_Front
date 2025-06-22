import { Loader2, Hotel } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Animated background circle */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <Hotel className="w-12 h-12 text-white" />
          </div>
          
          {/* Spinning loader */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cargando Dashboard
        </h2>
        <p className="text-gray-600 max-w-md">
          Preparando el sistema de gestión hotelera...
        </p>
        
        {/* Loading dots */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}
