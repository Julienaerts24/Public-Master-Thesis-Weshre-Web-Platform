import { useRouter, usePathname } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();
  const currentPathname = usePathname();

  const navigate = (route: string) => {
    const pathSegments = currentPathname.split("/");
    const basePath = pathSegments.slice(0, pathSegments.length - 1).join("/");
    const newPath = `${basePath}/${route}`;
    router.push(newPath);
  };
  return navigate;
};

export const useNavigationBack = () => {
  const router = useRouter();
  const currentPathname = usePathname();

  const navigateBack = () => {
    const pathSegments = currentPathname.split("/");
    const basePath = pathSegments.slice(0, pathSegments.length - 1).join("/");
    router.push(basePath);
  };
  return navigateBack;
};
