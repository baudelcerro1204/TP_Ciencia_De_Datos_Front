"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Loader2,
  ArrowLeft,
  BarChart3,
  Target,
  Shield,
  Gift,
  MessageSquare,
  Star,
  Clock,
  Phone,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";


interface ReservationData {
  id: string;
  guest_name: string;
  arrival_date_year: number
  arrival_date_month: string
  arrival_date_day_of_month: number
  departure_date: string;
  lead_time: number;
  adults: number;
  children: number;
  babies: number;
  adr: number;
  deposit_type: string;
  market_segment: string;
  stays_in_weekend_nights: number;
  stays_in_week_nights: number;
  status: string;
}

interface ShapExplanation {
  feature: string;
  impact: number;
}

interface PredictionResult {
  probabilidad_cancelacion: number
  prediccion: string
  explicacion_shap: {
    feature: string
    impact: number
  }[]
}

interface ClusterResult {
  cluster: number
  cluster_name: string
  cancellation_rate: number
  strategy: string
  strategy_icon: React.ReactNode
  strategy_color: string
}

// Definición de estrategias por segmento (actualizado para k=2)
const SEGMENT_STRATEGIES = {
  0: [
    {
      name: "Atención Familiar Premium",
      description: "Ofrecer servicios exclusivos para familias, como habitaciones conectadas, amenities para niños y descuentos en actividades familiares. Comunicación personalizada destacando beneficios premium.",
      icon: <Gift className="w-5 h-5" />, 
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      name: "Upgrade y Beneficios",
      description: "Proponer upgrades gratuitos o con descuento, desayuno incluido y check-out extendido para reservas familiares de alto valor.",
      icon: <Star className="w-5 h-5" />, 
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      name: "Recordatorio Anticipado",
      description: "Enviar recordatorio personalizado 10 días antes de la llegada, resaltando servicios para niños y actividades familiares.",
      icon: <MessageSquare className="w-5 h-5" />, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ],
  1: [
    {
      name: "Oferta Flexible",
      description: "Ofrecer condiciones flexibles de reserva y cancelación, y destacar promociones para reservas anticipadas.",
      icon: <Clock className="w-5 h-5" />, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      name: "Comunicación Eficiente",
      description: "Enviar emails informativos sobre servicios y actividades del hotel, enfatizando la facilidad y rapidez del proceso de check-in.",
      icon: <MessageSquare className="w-5 h-5" />, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      name: "Beneficio por Anticipación",
      description: "Ofrecer descuentos exclusivos o upgrades menores para incentivar la confirmación temprana de la reserva.",
      icon: <Gift className="w-5 h-5" />, 
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ]
};

// Función para seleccionar estrategia aleatoria
const getRandomStrategy = (cluster: number) => {
  const strategies = SEGMENT_STRATEGIES[cluster as keyof typeof SEGMENT_STRATEGIES] || SEGMENT_STRATEGIES[0];
  const randomIndex = Math.floor(Math.random() * strategies.length);
  return strategies[randomIndex];
};

export default function EvaluateReservation({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [clusterResult, setClusterResult] = useState<ClusterResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedReservation = localStorage.getItem("selectedReservation");
    if (storedReservation) {
      setReservation(JSON.parse(storedReservation));
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (reservation) {
      evaluateReservation();
    }
  }, [reservation]);

  const evaluateReservation = async () => {
    if (!reservation) return
  
    setLoading(true)
  
    try {
      const response = await fetch(`http://localhost:8000/api/evaluate-booking/${reservation.id}`)
      if (!response.ok) throw new Error("Error al obtener predicción")
  
      const result = await response.json()
      
      // Asignar nombres de cluster según nueva segmentación
      const clusterNames = [
        "Reservas familiares premium",
        "Reservas estándar anticipadas"
      ];
      // Seleccionar estrategia aleatoria
      const randomStrategy = getRandomStrategy(result.cluster);
      
      setClusterResult({
        cluster: result.cluster,
        cluster_name: clusterNames[result.cluster] || `Segmento ${result.cluster}`,
        cancellation_rate: result.probabilidad_cancelacion_cluster,
        strategy: randomStrategy.description,
        strategy_icon: randomStrategy.icon,
        strategy_color: randomStrategy.color,
      })
  
      setPredictionResult({
        probabilidad_cancelacion: result.probabilidad_cancelacion,
        prediccion: result.prediccion,
        explicacion_shap: result.explicacion_shap,
      })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }
  

  const getRecommendation = (probability: number) => {
    if (probability > 0.50) {
      return {
        text: "Sugerir depósito no reembolsable",
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        color: "destructive",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    } else if (probability > 0.20 && probability <= 0.50) {
      return {
        text: "No se requieren acciones inmediatas.",
        icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
        color: "secondary",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    } else if (probability < 0.20) {
      return {
        text: "Evaluar upgrade gratuito o beneficio",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        color: "default",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else {
      return {
        text: "Sin acción requerida",
        icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
        color: "secondary",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    }
  };

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cargando información
          </h3>
          <p className="text-gray-600">
            Obteniendo datos de la reserva...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-white/80 backdrop-blur-sm transition-all duration-200 rounded-xl"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> 
            Volver al Dashboard
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Image src="/logo.png" alt="Hotel Logo" width={64} height={64} className="rounded-lg" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                    Evaluación de Reserva
                  </h1>
                  <p className="text-gray-600 mt-1 text-lg">Análisis predictivo y recomendaciones</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 border-blue-200">
                  ID: {reservation.id}
                </Badge>
                <Badge 
                  variant={reservation.status === "Confirmada" ? "default" : "secondary"}
                  className={`px-4 py-2 text-sm font-medium ${
                    reservation.status === "Confirmada" 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }`}
                >
                  {reservation.status}
                </Badge>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="font-semibold text-gray-900 mb-2">Huésped</h3>
              <p className="text-2xl font-bold text-gray-900">{reservation.guest_name}</p>
            </div>
          </div>
        </div>

        {/* Reservation Details Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Detalles de la Reserva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Información General</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Llegada:</span>
                    <span className="font-medium text-gray-900">
                      {`${reservation.arrival_date_day_of_month} ${reservation.arrival_date_month} ${reservation.arrival_date_year}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Salida:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(reservation.departure_date + "T12:00:00").toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Anticipación:</span>
                    <span className="font-medium text-gray-900">{reservation.lead_time} días</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Huéspedes</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Adultos:</span>
                    <span className="font-medium text-gray-900">{reservation.adults}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Niños:</span>
                    <span className="font-medium text-gray-900">{reservation.children}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Bebés:</span>
                    <span className="font-medium text-gray-900">{reservation.babies}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Detalles de Pago</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Monto:</span>
                    <span className="font-bold text-green-600">${reservation.adr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Depósito:</span>
                    <span className="font-medium text-gray-900">{reservation.deposit_type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Segmento:</span>
                    <span className="font-medium text-gray-900">{reservation.market_segment}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prediction Card */}
          {loading ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="flex items-center justify-center h-80">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analizando datos
                  </h3>
                  <p className="text-gray-600">
                    Procesando información de la reserva...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {predictionResult && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      Predicción de Cancelación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Probability Display */}
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-white">
                              {Math.round(predictionResult.probabilidad_cancelacion * 100)}%
                            </div>
                            <div className="text-sm text-blue-100">Probabilidad</div>
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <Badge
                            variant={predictionResult.probabilidad_cancelacion > 0.5 ? "destructive" : "default"}
                            className={`px-3 py-1 rounded-full font-medium ${
                              predictionResult.probabilidad_cancelacion > 0.5
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-green-100 text-green-800 border-green-200"
                            }`}
                          >
                            {predictionResult.prediccion}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Probabilidad de cancelación</span>
                        <span className="font-medium text-gray-900">
                          {Math.round(predictionResult.probabilidad_cancelacion * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={predictionResult.probabilidad_cancelacion * 100}
                        className="h-3 bg-gray-200"
                      />
                    </div>

                    {/* Influencing Factors */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Factores Influyentes
                      </h4>
                      <div className="space-y-3">
                        {predictionResult.explicacion_shap?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="capitalize text-gray-700">
                              {item.feature.replace("num__", "").replace("_", " ")}
                            </span>
                            <span className={`font-medium ${
                              item.impact > 0 ? "text-red-600" : "text-green-600"
                            }`}>
                              {item.impact > 0 ? "+" : ""}{item.impact.toFixed(3)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendation Alert */}
                    <Alert className={`border-2 ${getRecommendation(predictionResult.probabilidad_cancelacion).borderColor} ${getRecommendation(predictionResult.probabilidad_cancelacion).bgColor}`}>
                      <div className="flex items-center gap-3">
                        {getRecommendation(predictionResult.probabilidad_cancelacion).icon}
                        <AlertDescription className="text-gray-800">
                          <strong>Recomendación:</strong>{" "}
                          {getRecommendation(predictionResult.probabilidad_cancelacion).text}
                        </AlertDescription>
                      </div>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* Customer Segmentation Card */}
              {clusterResult && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      Segmentación de Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Cluster Info */}
                    <div className="text-center">
                      <Badge variant="outline" className="text-xl px-6 py-3 rounded-full border-2 border-purple-200">
                        {clusterResult.cluster === 0 ? "Reservas familiares premium" : "Reservas estándar anticipadas"}
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mt-3">
                        {clusterResult.cluster === 0
                          ? "Familias con presupuesto elevado, reservas con lead_time medio, niños y ADR alto."
                          : "Clientes estándar, reservas anticipadas, sin niños y ADR más bajo."}
                      </h3>
                    </div>

                    {/* Cancellation Rate */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                        <span className="font-semibold text-gray-900">
                          Tasa de cancelación del segmento
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-purple-600">
                        {Math.round(clusterResult.cancellation_rate * 100)}%
                      </div>
                    </div>

                    {/* Strategy */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        Estrategia Recomendada
                      </h4>
                      <div className={`p-4 rounded-xl border-2 ${clusterResult.strategy_color.replace('text-', 'bg-').replace('-600', '-50')} ${clusterResult.strategy_color.replace('text-', 'border-').replace('-600', '-200')}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${clusterResult.strategy_color.replace('text-', 'bg-').replace('-600', '-100')}`}> 
                            {clusterResult.strategy_icon}
                          </div>
                          <h5 className="font-semibold text-gray-900">
                            Estrategia Seleccionada
                          </h5>
                        </div>
                        <p className="text-gray-800 leading-relaxed">
                          {clusterResult.strategy}
                        </p>
                      </div>
                    </div>

                    {/* Profile Indicator */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 font-medium">
                        Perfil de cliente identificado y analizado
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
