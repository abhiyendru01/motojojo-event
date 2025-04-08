
import { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  title: string;
  type: 'event' | 'artist' | 'experience';
  subtitle?: string;
  image_url?: string;
  path: string;
}

const NavbarSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const searchData = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search events
      const { data: events } = await supabase
        .from('events')
        .select('id, title, city, category, image_url')
        .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
        .limit(5);

      // Search artists
      const { data: artists } = await supabase
        .from('artist_profiles')
        .select('id, name, artist_type, profile_picture')
        .or(`name.ilike.%${searchQuery}%, bio.ilike.%${searchQuery}%`)
        .limit(5);

      // Search experiences
      const { data: experiences } = await supabase
        .from('experiences')
        .select('id, title, city, type, image_url')
        .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
        .limit(3);

      // Format results
      const formattedResults: SearchResult[] = [
        ...(events?.map(event => ({
          id: event.id,
          title: event.title,
          type: 'event' as const,
          subtitle: `${event.city} • ${event.category}`,
          image_url: event.image_url,
          path: `/event/${event.id}`
        })) || []),
        ...(artists?.map(artist => ({
          id: artist.id,
          title: artist.name,
          type: 'artist' as const,
          subtitle: artist.artist_type,
          image_url: artist.profile_picture,
          path: `/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`
        })) || []),
        ...(experiences?.map(exp => ({
          id: exp.id,
          title: exp.title,
          type: 'experience' as const,
          subtitle: `${exp.city} • ${exp.type}`,
          image_url: exp.image_url,
          path: `/experience/${exp.id}`
        })) || [])
      ];

      setResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(searchData, 300), [searchData]);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = (path: string) => {
    navigate(path);
    setShowResults(false);
    setQuery("");
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search for events, artists, venues..."
          className="pl-10 pr-16 w-full border border-black"
          value={query}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
        />
      </div>

      {showResults && (query.trim() !== "" || isSearching) && (
        <div className="absolute w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleResultClick(result.path)}
                >
                  {result.image_url ? (
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      <img
                        src={result.image_url}
                        alt={result.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                      {result.type === 'event' && <Search className="h-5 w-5 text-gray-500" />}
                      {result.type === 'artist' && <Search className="h-5 w-5 text-gray-500" />}
                      {result.type === 'experience' && <Search className="h-5 w-5 text-gray-500" />}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-sm">{result.title}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="capitalize mr-1">{result.type}</span>
                      {result.subtitle && <span>• {result.subtitle}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() !== "" ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
