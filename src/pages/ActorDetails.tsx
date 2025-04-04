
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchActorDetails } from "@/services/api";
import { MovieCard } from "@/components/movie-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

const ActorDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { 
    data: actor,
    isLoading,
    error
  } = useQuery({
    queryKey: ['actor', id],
    queryFn: () => fetchActorDetails(id || ''),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/3 aspect-[3/4] rounded-md" />
          <div className="w-full md:w-2/3 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold">Error loading actor details</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Actor image */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <img 
            src={actor.image_url || "https://via.placeholder.com/300x450?text=No+Image"} 
            alt={actor.name} 
            className="w-full rounded-lg aspect-[3/4] object-cover shadow-lg"
          />
        </div>

        {/* Actor details */}
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{actor.name}</h1>
            
            {actor.birth_date && (
              <p className="text-muted-foreground mt-2">
                {actor.birth_date}
                {actor.death_date && ` - ${actor.death_date}`}
              </p>
            )}

            {actor.birth_place && (
              <p className="text-muted-foreground">
                Born in {actor.birth_place}
              </p>
            )}
          </div>

          <Tabs defaultValue="bio" className="mt-6">
            <TabsList>
              <TabsTrigger value="bio">Biography</TabsTrigger>
              <TabsTrigger value="filmography">Filmography</TabsTrigger>
              <TabsTrigger value="trivia">Trivia</TabsTrigger>
              <TabsTrigger value="awards">Awards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bio" className="space-y-4 mt-4">
              <p className="whitespace-pre-line">{actor.bio || "No biography available."}</p>
              
              {actor.known_for && actor.known_for.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Known For</h3>
                  <ScrollArea>
                    <div className="flex gap-4 pb-4">
                      {actor.known_for.map((work: any) => (
                        <MovieCard 
                          key={work.id} 
                          movie={work} 
                          className="w-[160px] sm:w-[200px] flex-shrink-0"
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="filmography" className="space-y-6 mt-4">
              {actor.filmography && actor.filmography.length > 0 ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Movies and TV Shows</h3>
                    <div className="space-y-4">
                      {actor.filmography.map((work: any) => (
                        <div key={work.id} className="flex items-start justify-between border-b pb-4">
                          <div>
                            <h4 className="font-medium">{work.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {work.year} • {work.character || "Unknown role"}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {work.type || "Movie"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p>No filmography information available.</p>
              )}
            </TabsContent>
            
            <TabsContent value="trivia" className="space-y-4 mt-4">
              {actor.trivia && actor.trivia.length > 0 ? (
                <ul className="space-y-3 list-disc pl-5">
                  {actor.trivia.map((fact: string, index: number) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              ) : (
                <p>No trivia available.</p>
              )}
              
              {actor.quotes && actor.quotes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Quotes</h3>
                  <ul className="space-y-3">
                    {actor.quotes.map((quote: string, index: number) => (
                      <li key={index} className="italic border-l-2 border-primary pl-4 py-1">
                        "{quote}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="awards" className="space-y-4 mt-4">
              {actor.awards && actor.awards.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Awards and Nominations</h3>
                  <div className="space-y-6">
                    {actor.awards.map((award: any, index: number) => (
                      <div key={index} className="border-b pb-4">
                        <h4 className="font-medium">{award.name}</h4>
                        <p className="text-sm text-muted-foreground">{award.year}</p>
                        <p>{award.category}</p>
                        <p className="text-sm">
                          {award.outcome === "Winner" ? (
                            <span className="text-yellow-500 font-medium">Winner</span>
                          ) : (
                            <span>Nominated</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No award information available.</p>
              )}
            </TabsContent>
          </Tabs>
          
          {/* External links */}
          {actor.external_links && actor.external_links.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <h3 className="text-lg font-medium mb-3">External Links</h3>
              <div className="flex flex-wrap gap-3">
                {actor.external_links.map((link: any, index: number) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
                  >
                    {link.name} <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorDetails;
