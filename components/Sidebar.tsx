"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  HomeIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  FolderIcon,
  UsersIcon,
  PlusCircleIcon,
  Bars3Icon,
  XMarkIcon,
  CloudArrowUpIcon,
  ClockIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/context/ThemeContext";

interface UserProfile {
  username: string;
  email: string;
  credits: number;
  totalRenders: number;
  successRate: number;
  activeNodes: number;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/users/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Profil yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchProfile();
    }
  }, [session]);


  // Örnek son projeler
  const latestProjects = [
    { name: "untitled16", owner: "novas_studio" },
    { name: "render up", owner: "manubaba" },
    { name: "cy 8192 4k", owner: "xiahuanya" },
    { name: "Devil_valey_0004", owner: "peaceblender" },
    { name: "Backrooms LVL 3", owner: "Ex0Zeds" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static w-64 bg-gray-100 dark:bg-gray-800/50 h-screen p-4 flex flex-col border-r border-gray-200 dark:border-gray-700 shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <div>
              <h1 className="font-semibold dark:text-white">BoardFarm</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Render Farm
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        <nav className="flex-1">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                pathname === "/dashboard"
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/my-farm"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                pathname === "/my-farm"
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <CpuChipIcon className="w-5 h-5" />
              <span>My Farm</span>
            </Link>
            {loading ? (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400">
                <UserCircleIcon className="w-5 h-5" />
                <span>Profile</span>
              </div>
            ) : (
              <Link
                href={`/user/${profile?.username}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  pathname === `/user/${profile?.username}`
                    ? "bg-primary text-white" 
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            )}


            <Link
              href="/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                pathname === "/settings"
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <Cog6ToothIcon className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold dark:text-white">Community</h2>
            </div>
            <div className="space-y-1">
              <Link
                href="/public"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  pathname === "/public"
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <UsersIcon className="w-5 h-5" />
                <span>All Projects</span>
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold dark:text-white">Latest Projects</h2>
            </div>
            <div className="mt-4 space-y-2">
              {latestProjects.map((project, index) => (
                <Link
                  key={index}
                  href={`/project/${project.name}`}
                  className={`block px-3 py-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-300/50 dark:hover:bg-gray-600/50 ${
                    pathname === `/project/${project.name}`
                      ? "bg-primary text-white"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {project.owner}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <button className="mt-auto flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg">
          <PlusCircleIcon className="w-5 h-5" />
          <span>Add New Node</span>
        </button>
      </div>
    </>
  );
}
