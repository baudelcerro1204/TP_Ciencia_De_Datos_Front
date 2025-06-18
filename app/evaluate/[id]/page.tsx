"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
}


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
  
      setPredictionResult({
        probabilidad_cancelacion: result.probabilidad_cancelacion,
        prediccion: result.prediccion,
        explicacion_shap: result.explicacion_shap,
      })
  
      setClusterResult({
        cluster: result.cluster,
        cluster_name: result.cluster_nombre,
        cancellation_rate: result.probabilidad_cancelacion_cluster,
        strategy:
          result.cluster === 0
            ? "Reservas anticipadas - Enviar recordatorio personalizado"
            : result.cluster === 1
            ? "Planificación media - Ofrecer beneficios moderados"
            : "Reservas especiales - Priorizar atención y confirmación",
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
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
        color: "destructive",
      };
    } else if (probability > 0.20 && probability <= 0.50) {
      return {
        text: "No se requieren acciones inmediatas.",
        icon: <CheckCircle className="w-4 h-4 text-blue-500" />,
        color: "secondary",
      };
    } else if (probability < 0.20) {
      return {
        text: "Evaluar upgrade gratuito o beneficio",
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        color: "default",
      };
    } else {
      return {
        text: "Sin acción requerida",
        icon: <CheckCircle className="w-4 h-4 text-blue-500" />,
        color: "secondary",
      };
    }
  };

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
          <p className="mt-2 text-gray-600">
            Cargando información de la reserva...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/")}
          >
            {" "}
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al listado{" "}
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Evaluación de Reserva: {reservation.id}
              </h1>
              <p className="text-gray-600">Huésped: {reservation.guest_name}</p>
            </div>
            <Badge
              variant={
                reservation.status === "Confirmada" ? "default" : "secondary"
              }
              className="text-sm px-3 py-1"
            >
              {reservation.status}
            </Badge>
          </div>
        </div>

        {/* Detalles de la reserva */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Detalles de la Reserva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-500 mb-2">
                  Información General
                </h3>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Llegada:</span>{" "}
                    {`${reservation.arrival_date_day_of_month} ${reservation.arrival_date_month} ${reservation.arrival_date_year}`}
                  </p>
                  <p>
                  <span className="font-medium">Salida:</span>{" "}
                  {new Date(reservation.departure_date + "T12:00:00").toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Tiempo de Anticipación:</span>{" "}
                    {reservation.lead_time} días
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-500 mb-2">Huéspedes</h3>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Adultos:</span>{" "}
                    {reservation.adults}
                  </p>
                  <p>
                    <span className="font-medium">Niños:</span>{" "}
                    {reservation.children}
                  </p>
                  <p>
                    <span className="font-medium">Bebés:</span>{" "}
                    {reservation.babies}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-500 mb-2">
                  Detalles de Pago
                </h3>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Monto de Reserva:</span> ${reservation.adr}
                  </p>
                  <p>
                    <span className="font-medium">Tipo de Depósito:</span>{" "}
                    {reservation.deposit_type}
                  </p>
                  <p>
                    <span className="font-medium">Segmento:</span>{" "}
                    {reservation.market_segment}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Predicción de Cancelación */}
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
                  <p className="mt-2 text-gray-600">
                    Analizando datos de la reserva...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {predictionResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Predicción de Cancelación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-2">
                            {Math.round(
                              predictionResult.probabilidad_cancelacion * 100
                            )}
                            %
                          </div>
                          <Badge
                            variant={
                              predictionResult.probabilidad_cancelacion > 0.5
                                ? "destructive"
                                : "default"
                            }
                          >
                            {predictionResult.prediccion}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Probabilidad de cancelación</span>
                            <span>
                              {Math.round(
                                predictionResult.probabilidad_cancelacion * 100
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              predictionResult.probabilidad_cancelacion * 100
                            }
                            className="h-3"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Factores Influyentes</h4>
                        <div className="space-y-2">
                          {predictionResult.explicacion_shap?.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="capitalize">
                                  {item.feature
                                    .replace("num__", "")
                                    .replace("_", " ")}{" "}
                                  ({item.impact > 0 ? "+" : ""}
                                  {item.impact.toFixed(3)})
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <Alert>
                      <div className="flex items-center gap-2">
                        {
                          getRecommendation(
                            predictionResult.probabilidad_cancelacion
                          ).icon
                        }
                        <AlertDescription>
                          <strong>Recomendación:</strong>{" "}
                          {
                            getRecommendation(
                              predictionResult.probabilidad_cancelacion
                            ).text
                          }
                        </AlertDescription>
                      </div>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* Segmentación de Clientes */}
              {clusterResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Segmentación de Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Badge
                            variant="outline"
                            className="text-lg px-4 py-2"
                          >
                            Segmento {clusterResult.cluster}
                          </Badge>
                          <h3 className="text-xl font-semibold mt-2">
                            {clusterResult.cluster_name}
                          </h3>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm">
                              Tasa de cancelación del segmento:
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(clusterResult.cancellation_rate * 100)}%
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">
                          Estrategia Recomendada
                        </h4>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            {clusterResult.strategy}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>Perfil de cliente identificado</span>
                        </div>
                      </div>
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
