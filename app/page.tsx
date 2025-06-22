"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Search,
  Eye,
  ArrowUpDown,
  Filter,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Reservation {
  id: string
  guest_name: string
  arrival_date_year: number
  arrival_date_month: string
  arrival_date_day_of_month: number
  departure_date: string
  adr: number
  country: string
  status: string
}

export default function ReservationDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/all-bookings")
        const data = await res.json()

        const formatted = data.map((r: any) => ({
          ...r,
          status: "Confirmada" // o podés mapear esto de tu modelo futuro
        }))

        setReservations(formatted)
      } catch (err) {
        console.error("Error al obtener reservas:", err)
      }
    }

    fetchReservations()
  }, [])

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      reservation.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleEvaluateReservation = (reservation: any) => {
    localStorage.setItem("selectedReservation", JSON.stringify(reservation))
    router.push(`/evaluate/${reservation.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Image src="/logo.png" alt="Hotel Logo" width={64} height={64} className="rounded-lg" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Dashboard de Gestión Hotelera
              </h1>
              <p className="text-gray-600 mt-1 text-lg">Historial de reservas y análisis predictivo</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                  <p className="text-3xl font-bold text-gray-900">{reservations.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                  <p className="text-3xl font-bold text-green-600">
                    {reservations.filter(r => r.status === "Confirmada").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Huéspedes Únicos</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {new Set(reservations.map(r => r.guest_name)).size}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Historial de Reservas
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Visualice y analice las reservas recibidas con herramientas avanzadas de filtrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Section */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o ID de reserva..."
                  className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full lg:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-gray-400" />
                      <SelectValue placeholder="Filtrar por estado" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="confirmada">Confirmada</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table Section */}
            <div className="rounded-2xl border-2 border-gray-100 overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50">
                    <TableHead className="font-semibold text-gray-700 py-4">ID de Reserva</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Huésped</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Llegada</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Salida</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Monto</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4">Estado</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 py-4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation, index) => (
                    <TableRow 
                      key={reservation.id}
                      className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <TableCell className="font-mono text-sm font-medium text-gray-900 py-4">
                        {reservation.id}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 py-4">
                        {reservation.guest_name}
                      </TableCell>
                      <TableCell className="text-gray-700 py-4">
                        {`${reservation.arrival_date_day_of_month} ${reservation.arrival_date_month} ${reservation.arrival_date_year}`}
                      </TableCell>
                      <TableCell className="text-gray-700 py-4">
                        {new Date(reservation.departure_date + "T12:00:00").toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 py-4">
                        ${reservation.adr.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          variant={reservation.status === "Confirmada" ? "default" : "secondary"}
                          className={`px-3 py-1 rounded-full font-medium ${
                            reservation.status === "Confirmada" 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        >
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 rounded-lg"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Evaluar
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => handleEvaluateReservation(reservation)}
                              className="cursor-pointer hover:bg-blue-50"
                            >
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Analizar Reserva
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Empty State */}
            {filteredReservations.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron reservas
                </h3>
                <p className="text-gray-600">
                  No se encontraron reservas que coincidan con los criterios de búsqueda
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
