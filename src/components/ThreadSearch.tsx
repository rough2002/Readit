"use client";

import { useState, useEffect, useRef } from "react";
import { fetchSubreddits } from "@/lib/actions";
import { CiSearch } from "react-icons/ci";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Input } from "./ui/input";
import { Option } from "@/types";

interface Props {
  selectedSubreddit: Option | null;
  setSelectedSubreddit: (subreddit: Option | null) => void;
}

export function ThreadSearch({
  selectedSubreddit,
  setSelectedSubreddit,
}: Props) {
  const [search, setSearch] = useState("");
  const [subredditData, setSubredditData] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useOutsideClick(() => setSearch(""));

  useEffect(() => {
    const fetchData = async () => {
      if (search.length > 0 && search.replace(/\s/g, "").length > 0) {
        setLoading(true);
        try {
          const data = await fetchSubreddits(search);
          const subreddits = data.map((i) => {
            return { value: i.id, label: i.name };
          });
          setSubredditData(subreddits);
          setError(null);
        } catch (err) {
          setError("An error occurred while fetching data.");
          setSubredditData([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSubredditData([]);
      }
    };

    fetchData();
  }, [search]);

  return (
    <div
      className="w-1/4 flex items-center py-2.5 pl-2 md:p-2.5 space-x-3 rounded-md relative"
      ref={searchRef}
    >
      {selectedSubreddit ? (
        <div
          className="flex items-center cursor-pointer bg-gray-200 px-3 py-1 rounded-full"
          onClick={() => setSelectedSubreddit(null)}
        >
          <span className="text-md text-black font-semibold">
            r/{selectedSubreddit.label}
          </span>
          {/* {selectedSubreddit.logo && (
            <img
              //   src={selectedSubreddit.}
              className="object-cover w-6 h-6 rounded-full ml-2"
              alt="logo"
            />
          )} */}
        </div>
      ) : (
        <>
          <CiSearch className="w-6 h-6" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            name="search"
            id="search"
            className="py-0.5 w-48 md:w-full text-white focus:outline-none md:pr-20"
            placeholder="Find community"
          />
          {loading && (
            <p className="absolute right-0 top-full z-50 p-5 mt-3">
              Loading...
            </p>
          )}
          {error && (
            <p className="absolute right-0 top-full z-50 p-5 mt-3">{error}</p>
          )}
          {subredditData.length > 0 && search && (
            <ul className="flex absolute right-0 top-full z-50 flex-col p-5 mt-3 space-y-5 w-full list-none bg-white rounded-md border shadow-xl border-y-theme-gray-blue text-black">
              {subredditData.slice(0, 5).map((subreddit) => (
                <li
                  className={`flex space-x-5 cursor-pointer ${
                    !subreddit.label && "pl-[3.75rem]"
                  }`}
                  key={subreddit.value}
                  onClick={() => {
                    setSelectedSubreddit(subreddit);
                    setSearch("");
                  }}
                >
                  {/* {subreddit?.logo && (
                    <img
                      src={subreddit.logo}
                      className="object-cover w-10 h-10 rounded-full"
                      alt="logo"
                    />
                  )} */}
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold tracking-wide md:text-base text-black">
                      r/{subreddit.label}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
