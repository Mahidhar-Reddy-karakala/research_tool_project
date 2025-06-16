"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Plus, CalendarIcon as CalendarIconLucide, LineChart, Trash2, ArrowLeft, CalendarIcon } from "lucide-react"
import axios from "axios"
import { stocks } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parse } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Markdown from "react-markdown"

interface TimelineEntry {
  id: string
  stockId: string
  note: string
  date: string
  type: "analysis" | "news" | "price-target"
  createdAt?: string
}

export default function Timeline() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [dateInputValue, setDateInputValue] = useState("")
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [stocksWithEntries, setStocksWithEntries] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dateInputMethod, setDateInputMethod] = useState<"calendar" | "input">("input")
  const { toast } = useToast()

  const resetNewEntry = (stockId = "") => ({
    stockId,
    note: "",
    date: "",
    type: "analysis" as const,
  })

  const [newEntry, setNewEntry] = useState(resetNewEntry())

  useEffect(() => {
    fetchStocksWithEntries()
  }, [])

  useEffect(() => {
    if (selectedStock) {
      fetchTimelineEntries(selectedStock)
    }
  }, [selectedStock])

  const fetchStocksWithEntries = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://localhost:5000/api/timeline/stocks-with-entries")
      setStocksWithEntries(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch stocks with timeline entries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTimelineEntries = async (stockId: string) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://localhost:5000/api/timeline/stock/${stockId}`)
      const entriesWithId: TimelineEntry[] = (response.data as any[]).map(entry => ({
        id: entry._id,              // map _id to id
        stockId: entry.stockId,
        note: entry.note,
        date: entry.date,
        type: entry.type,
        createdAt: entry.createdAt,
      }));
  
      setEntries(entriesWithId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch timeline entries",
        variant: "destructive",
      })
      setEntries([])
    } finally {
      setIsLoading(false)
    }
  }

  // Group entries by stock
  const groupedByStock = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.stockId]) {
        acc[entry.stockId] = []
      }
      acc[entry.stockId].push(entry)
      return acc
    },
    {} as Record<string, TimelineEntry[]>,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const finalDate =
      dateInputMethod === "input" ? dateInputValue : selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""

    if (!finalDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return
    }

    const entry = {
      ...newEntry,
      stockId: selectedStock || newEntry.stockId,
      date: finalDate,
    }

    try {
      await axios.post("http://localhost:5000/api/timeline", entry)

      toast({
        title: "Success",
        description: "Timeline entry created successfully",
      })

      setIsModalOpen(false)
      setNewEntry(resetNewEntry(selectedStock || ""))
      setSelectedDate(undefined)
      setDateInputValue("")

      if (selectedStock) {
        fetchTimelineEntries(selectedStock)
      }
      fetchStocksWithEntries()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to create timeline entry"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/timeline/${id}`)
      toast({
        title: "Success",
        description: "Timeline entry deleted successfully",
      })
      if (selectedStock) {
        fetchTimelineEntries(selectedStock)
      }
      fetchStocksWithEntries()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete timeline entry",
        variant: "destructive",
      })
    } finally {
      setShowDeleteConfirm(null)
    }
  }

  const getStockName = (stockId: string) => {
    return stocks.find((stock) => stock.id === stockId)?.name || "Unknown Stock"
  }

  const getStockSymbol = (stockId: string) => {
    return stocks.find((stock) => stock.id === stockId)?.symbol || "Unknown"
  }

  const renderEntryTypeLabel = (type: TimelineEntry["type"]) => {
    switch (type) {
      case "analysis":
        return "Analysis"
      case "news":
        return "News"
      case "price-target":
        return "Price Target"
      default:
        return type
    }
  }

  // Calendar date selection handler
  const handleDateSelect = (date: Date | undefined) => {
    console.log("Calendar date selected:", date)
    if (date) {
      setSelectedDate(date)
      setNewEntry((prev) => ({
        ...prev,
        date: format(date, "yyyy-MM-dd"),
      }))
    }
  }

  // Input date change handler
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateInputValue(value)
    setNewEntry((prev) => ({
      ...prev,
      date: value,
    }))
  }

  const isFormValid = () => {
    const hasDate = dateInputMethod === "input" ? !!dateInputValue : !!selectedDate
    const hasStock = !!(selectedStock || newEntry.stockId)
    const hasNote = !!newEntry.note.trim()
    return hasDate && hasStock && hasNote
  }

  const renderEntryForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!selectedStock && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock</label>
          <Select value={newEntry.stockId} onValueChange={(value) => setNewEntry({ ...newEntry, stockId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a stock" />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((stock) => (
                <SelectItem key={stock.id} value={stock.id}>
                  {stock.symbol} - {stock.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          value={newEntry.type}
          onValueChange={(value: "analysis" | "news" | "price-target") => setNewEntry({ ...newEntry, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select entry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analysis">Analysis</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="price-target">Price Target</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Tabs value={dateInputMethod} onValueChange={(value: "calendar" | "input") => setDateInputMethod(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Date Input</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-2">
            <Input
              type="date"
              value={dateInputValue}
              onChange={handleDateInputChange}
              className="w-full"
              max={format(new Date(), "yyyy-MM-dd")}
            />
            {dateInputValue && (
              <p className="text-xs text-muted-foreground">
                Selected: {format(parse(dateInputValue, "yyyy-MM-dd", new Date()), "PPP")}
              </p>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
            {selectedDate && <p className="text-xs text-muted-foreground">Selected: {format(selectedDate, "PPP")}</p>}
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Note</label>
        <Textarea
          value={newEntry.note}
          onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
          placeholder="Enter your analysis or update..."
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsModalOpen(false)
            setSelectedDate(undefined)
            setDateInputValue("")
            setNewEntry(resetNewEntry(selectedStock || ""))
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!isFormValid()}>
          Add Entry
        </Button>
      </div>
    </form>
  )

  if (selectedStock) {
    const stockEntries = entries.filter((entry) => entry.stockId === selectedStock)
    const stockName = getStockName(selectedStock)
    const stockSymbol = getStockSymbol(selectedStock)

    return (
      <div className="space-y-6 pl-2 pr-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedStock(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{stockName}</h1>
              <p className="text-muted-foreground">{stockSymbol} Timeline</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setNewEntry(resetNewEntry(selectedStock))
              setSelectedDate(undefined)
              setDateInputValue("")
              setIsModalOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {stockEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <CalendarIconLucide className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{format(new Date(entry.date), "PPP")}</span>
                        </div>
                        <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {renderEntryTypeLabel(entry.type)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(entry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap"><Markdown>{entry.note}</Markdown></p>
                    
                    {showDeleteConfirm === entry.id && (
                      <div className="mt-4 flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(null)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timeline Entry for {stockSymbol}</DialogTitle>
            </DialogHeader>
            {renderEntryForm()}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6 pl-2 pr-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Timeline</h1>
          <p className="text-muted-foreground">Track and analyze stock events and updates</p>
        </div>
        <Button
          onClick={() => {
            setNewEntry(resetNewEntry())
            setSelectedDate(undefined)
            setDateInputValue("")
            setIsModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stocks.map((stock) => {
          const stockEntries = groupedByStock[stock.id] || []
          const latestEntry = stockEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

          return (
            <Card
              key={stock.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => setSelectedStock(stock.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <span>{stock.symbol}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">entries</span>
                </CardTitle>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Timeline Entry</DialogTitle>
          </DialogHeader>
          {renderEntryForm()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
