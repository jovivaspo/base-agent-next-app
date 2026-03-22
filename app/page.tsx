import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Next.js Agent Template
          </h1>
          <p className="text-lg text-muted-foreground">
            A production-ready Next.js 16 template with Clean Architecture, 
            shadcn/ui, Supabase, Drizzle, and more.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="default">Get Started</Button>
          <Button variant="outline">View Docs</Button>
          <Button variant="secondary">Learn More</Button>
          <Button variant="ghost">Browse</Button>
        </div>

        <div className="flex justify-center gap-2 pt-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>
    </div>
  )
}
