import { NavigationContainer } from '@react-navigation/native'
import { Box } from 'native-base'

import { useAuth } from '../hooks/useAuth'

import { AppRoutes } from '../routes/app.routes'
import { SigIn } from '../screens/Sigin'

export function Routes() {
    const { user } = useAuth();
    return (
        <Box flex={1} bg="gray.900">
        <NavigationContainer>
            {user.name ? <AppRoutes /> : <SigIn />}
        </NavigationContainer>
        </Box>
    )
};