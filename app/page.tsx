"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Gestión Hotelera
          </h1>
          <p className="text-gray-600">Historial de reservas y análisis predictivo</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Historial de Reservas
            </CardTitle>
            <CardDescription>
              Visualice y analice las reservas recibidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nombre o ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Huésped</TableHead>
                    <TableHead>Llegada</TableHead>
                    <TableHead>Salida</TableHead>
                    <TableHead>Monto de Reserva</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium text-xs">{reservation.id}</TableCell>
                      <TableCell>{reservation.guest_name}</TableCell>
                      <TableCell>{`${reservation.arrival_date_day_of_month} ${reservation.arrival_date_month} ${reservation.arrival_date_year}`}</TableCell>
                      <TableCell>{reservation.departure_date}</TableCell>
                      <TableCell>${reservation.adr}</TableCell>
                      <TableCell>
                        <Badge variant={reservation.status === "Confirmada" ? "default" : "secondary"}>
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Acciones
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEvaluateReservation(reservation)}>
                              Evaluar Reserva
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredReservations.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No se encontraron reservas que coincidan con los criterios de búsqueda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
