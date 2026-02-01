import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Radar, Menu, X, ChevronDown, User, LogOut, Heart, Bell } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetCategoriesQuery } from "@/store/products/productApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsAuthenticated, clearUser, setUser } from "@/store/auth/authSlice";
import { useGetUserProfileQuery } from "@/store/auth/authApiSlice";
import { clearTokens, isAuthenticated as checkAuth } from "@/lib/auth";
import { useEffect } from "react";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  
  const isAuthenticatedRedux = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const hasTokens = checkAuth();
  const { data: userProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery(undefined, {
    skip: !hasTokens,
  });

  const isAuthenticated = isAuthenticatedRedux || hasTokens;
  const currentUser = user || userProfile;

  // Initialize user from profile if we have tokens but no user in state
  useEffect(() => {
    if (hasTokens && userProfile && !user) {
      dispatch(setUser(userProfile));
    }
  }, [hasTokens, userProfile, user, dispatch]);

  const handleLogout = () => {
    clearTokens();
    dispatch(clearUser());
    navigate("/");
    setIsOpen(false);
  };

  const getInitials = (user: { first_name?: string; last_name?: string; username: string }) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.first_name) {
      return user.first_name[0].toUpperCase();
    }
    return user.username[0].toUpperCase();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="container mx-auto">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 px-6 py-3 flex items-center justify-between rounded-lg">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Radar className="w-5 h-5 text-background" />
            </div>
            <span className="text-lg font-bold text-foreground">PriceRadar</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact-us"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 outline-none">
                Products
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                {categoriesLoading ? (
                  <DropdownMenuItem className="text-muted-foreground cursor-default">
                    Loading...
                  </DropdownMenuItem>
                ) : categoriesData?.categories && categoriesData.categories.length > 0 ? (
                  categoriesData.categories.map((category) => (
                    category.subcategories && category.subcategories.length > 0 ? (
                      <DropdownMenuSub key={category.id}>
                        <DropdownMenuSubTrigger className="text-foreground">
                          {category.name}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-card border-border z-50">
                          <DropdownMenuItem
                            className="text-foreground cursor-pointer"
                            onClick={() => navigate(`/search?category_id=${category.id}`)}
                          >
                            All {category.name}
                          </DropdownMenuItem>
                          {category.subcategories.map((subcategory) => (
                            <DropdownMenuItem
                              key={subcategory.id}
                              className="text-foreground cursor-pointer"
                              onClick={() => navigate(`/search?category_id=${category.id}&subcategory_id=${subcategory.id}`)}
                            >
                              {subcategory.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ) : (
                      <DropdownMenuItem
                        key={category.id}
                        className="text-foreground cursor-pointer"
                        onClick={() => navigate(`/search?category_id=${category.id}`)}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    )
                  ))
                ) : (
                  <DropdownMenuItem className="text-muted-foreground cursor-default">
                    No categories available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-background text-sm font-semibold">
                        {getInitials(currentUser)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground font-medium">
                      {currentUser.first_name + ' ' + currentUser.last_name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                    <DropdownMenuItem
                      className="text-foreground cursor-pointer"
                      onClick={() => {
                        navigate("/saved-products");
                      }}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Saved Products
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-foreground cursor-pointer"
                      onClick={() => {
                        navigate("/account/profile");
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-foreground cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Button 
                  size="sm" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 bg-card border border-border/50 p-4 rounded-lg"
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact-us"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
              <div className="text-sm text-muted-foreground py-2">
                Products
              </div>
              <div className="pl-4 flex flex-col gap-2">
                {categoriesData?.categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      navigate(`/search?category_id=${category.id}`);
                      setIsOpen(false);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1 text-left"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                {isAuthenticated && currentUser ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-background text-sm font-semibold">
                          {getInitials(currentUser)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {currentUser.first_name + ' ' + currentUser.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start"
                      onClick={() => {
                        navigate("/saved-products");
                        setIsOpen(false);
                      }}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Saved Products
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => {
                        navigate("/register");
                        setIsOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
