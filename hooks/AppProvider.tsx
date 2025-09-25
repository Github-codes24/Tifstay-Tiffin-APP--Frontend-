import React from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // if (isChecking) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color={Colors.primary} />
  //     </View>
  //   );
  // }

  return <>{children}</>;
}
