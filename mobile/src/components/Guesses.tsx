import { useToast, FlatList } from 'native-base';
import { useState, useEffect } from 'react';
import { api } from '../services/api' 

import {EmptyMyPoolList} from '../components/EmptyMyPoolList'
import {Game, GameProps} from '../components/Game'
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [FirstTeamPoints, setFirstTeamPoints] = useState('')
  const [SecondTeamPoints, setSecondTeamPoints] = useState('')

  async function fetchGames() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games)
 

    } catch (error) {
      console.log(error);

      toast.show({
          title: 'Não foi possível carregar os jogos',
          placement: 'top',
          bgColor: 'red.500',
      })

  } finally {
      setIsLoading(false)
  }


  }
  
  async function handleGuessConfirm(gameId: string){
    try {
      
      if(!FirstTeamPoints.trim() || !SecondTeamPoints.trim() ){
       return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500',
      })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`,{
      FirstTeamPoints: Number(FirstTeamPoints),
      SecondTeamPoints: Number(SecondTeamPoints),
    });

    toast.show({
      title: 'Palpite enviado com sucesso',
      placement: 'top',
      bgColor: 'green.500',
  });

    fetchGames();


    } catch (error) {

      console.log(error);

      toast.show({
          title: 'Não foi possível enviar o palpite',
          placement: 'top',
          bgColor: 'red.500',
      })
    }
  }



  useEffect(() => {
    fetchGames();
  },[poolId]);

  if(isLoading){
    return <Loading />
  }


  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
          />
      )}
      _contentContainerStyle={{pb: 10}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
