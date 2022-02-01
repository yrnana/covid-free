import { useMemo } from 'react';
import { addDays, format, parse, setHours, startOfHour } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { useFieldArray, useForm } from 'react-hook-form';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import bgImg from './bg.webp';
import Button from './components/Button';

type FormValues = {
  housemates: {
    date: string;
    isVaccinated: boolean;
  }[];
};

const housematesState = atom<FormValues['housemates']>({
  key: 'housemates',
  default: [],
});

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <img
        src={bgImg}
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none"
      />
      <div className="relative p-6 bg-white shadow-md ring-1 ring-gray-900/5 mx-4 sm:max-w-lg sm:mx-auto sm:rounded-lg my-4 sm:my-8 divide-y divide-gray-200">
        <Form />
        <Result />
      </div>
    </div>
  );
}

export default App;

function Form() {
  const setHousemates = useSetRecoilState(housematesState);

  const { register, control, handleSubmit } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      housemates: [
        {
          date: format(new Date(), 'yyyy-MM-dd'),
          isVaccinated: true,
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: 'housemates',
    control,
  });

  const onSubmit = ({ housemates }: FormValues) => {
    housemates.sort(({ date: a }, { date: b }) => {
      if (a === b) return 0;
      if (a === '') return 1;
      if (b === '') return -1;
      return a > b ? 1 : -1;
    });
    housemates.forEach(({ date, isVaccinated }, index) => {
      update(index, {
        date,
        isVaccinated,
      });
    });
    setHousemates(housemates);
  };

  return (
    <form className="block" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="text-lg font-semibold">확진자 및 동거인</h2>
        <p className="text-sm text-gray-400 mb-4">
          <span className="text-red-500 mr-2">*</span>
          <span>확진자의 1)증상발현일 또는 2)확진일을 입력하세요.</span>
        </p>
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-wrap items-center mb-3">
            <div className="text-sm w-full mb-2 text-gray-700">
              {index + 1}번째 확진자 또는 동거인
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                disabled={field.date === ''}
                {...register(`housemates.${index}.date` as const)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
              />
              <Button
                color="secondary"
                onClick={() => {
                  update(index, {
                    ...field,
                    date:
                      field.date === '' ? format(new Date(), 'yyyy-MM-dd') : '',
                  });
                }}
              >
                {field.date === '' ? '음성' : '양성'}
              </Button>
              <Button
                color="secondary"
                onClick={() => {
                  update(index, {
                    ...field,
                    isVaccinated: !field.isVaccinated,
                  });
                }}
              >
                {field.isVaccinated ? '접종자' : '비접종자'}
              </Button>
              {fields.length > 1 && (
                <Button onClick={() => remove(index)}>삭제</Button>
              )}
            </div>
          </div>
        ))}
        <Button
          onClick={() =>
            append({
              date: format(new Date(), 'yyyy-MM-dd'),
              isVaccinated: true,
            })
          }
        >
          동거인 추가
        </Button>
      </div>
      <Button type="submit" className="w-40 mx-auto !flex mt-4">
        계산
      </Button>
    </form>
  );
}

function Result() {
  const housemates = useRecoilValue(housematesState);

  const data = useMemo(() => {
    if (housemates.length === 0) {
      return [];
    }
    const maxDate = housemates.reduce((acc, curr) => {
      if (curr.date === '') return acc;
      return acc > curr.date ? acc : curr.date;
    }, '');
    return housemates.map(({ date, isVaccinated }) =>
      getFreeDay(date === '' ? maxDate : date, isVaccinated),
    );
  }, [housemates]);

  if (housemates.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6">
      <h2 className="text-lg font-semibold">격리해제일</h2>
      <p className="text-sm text-gray-400 mb-4">
        <span className="text-red-500 mr-2">*</span>
        <span>증상에 따라 격리해제일이 연장될 수 있습니다.</span>
      </p>
      {data.map((date, index) => (
        <div key={index} className="sm:flex sm:space-x-2 mt-2 sm:mt-1 text-sm">
          <div className="text-gray-500 font-semibold">
            {index + 1}번째 확진자 또는 동거인
          </div>
          <div>
            {!housemates[index].isVaccinated &&
            housemates[index].date !== '' ? (
              <>
                <div>{getFreeDay(housemates[index].date, true)} (치료종료)</div>
                <div>{date} (격리해제)</div>
              </>
            ) : (
              <div>{date}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function getFreeDay(date: string, isVaccinated: boolean) {
  const parsed = parse(date, 'yyyy-MM-dd', new Date());
  const calculated = startOfHour(
    setHours(addDays(parsed, isVaccinated ? 8 : 11), 12),
  );
  return format(calculated, 'yyyy.MM.dd a hh시', { locale: ko });
}
