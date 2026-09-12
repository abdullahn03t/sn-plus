'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Calculator() {
  const t = useTranslations('calculator');

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('1.2');
  const [result, setResult] = useState(null);

  function handleCalculate(e) {
    e.preventDefault();

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const activityFactor = parseFloat(activity);

    if (!ageNum || !weightNum || !heightNum) return;

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const tdee = bmr * activityFactor;
    const proteinLow = Math.round(weightNum * 0.8);
    const proteinHigh = Math.round(weightNum * 1.8);

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      proteinLow,
      proteinHigh,
    });
  }

  return (
    <form onSubmit={handleCalculate} className="max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={() => setGender('male')} className={`rounded-lg border px-4 py-2 text-sm font-medium ${gender === 'male' ? 'bg-pine text-white border-pine' : 'border-sage-line text-ink'}`}>
          {t('male')}
        </button>
        <button type="button" onClick={() => setGender('female')} className={`rounded-lg border px-4 py-2 text-sm font-medium ${gender === 'female' ? 'bg-pine text-white border-pine' : 'border-sage-line text-ink'}`}>
          {t('female')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('age')}</label>
          <input type="number" required min="1" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-3 py-2 focus:outline-none focus:border-pine" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('weightKg')}</label>
          <input type="number" required min="1" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-3 py-2 focus:outline-none focus:border-pine" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70">{t('heightCm')}</label>
          <input type="number" required min="1" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-3 py-2 focus:outline-none focus:border-pine" />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink/70">{t('activityLevel')}</label>
        <select value={activity} onChange={(e) => setActivity(e.target.value)} className="mt-1 w-full rounded-lg border border-sage-line px-4 py-2 focus:outline-none focus:border-pine">
          <option value="1.2">{t('activitySedentary')}</option>
          <option value="1.375">{t('activityLight')}</option>
          <option value="1.55">{t('activityModerate')}</option>
          <option value="1.725">{t('activityActive')}</option>
          <option value="1.9">{t('activityVeryActive')}</option>
        </select>
      </div>

      <button type="submit" className="mt-6 w-full rounded-full bg-pine px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity">
        {t('calculate')}
      </button>

      {result && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-sage-line p-5 text-center">
            <p className="text-sm text-ink/60">{t('bmrLabel')}</p>
            <p className="mt-1 text-2xl font-bold text-pine">{result.bmr}</p>
            <p className="text-xs text-ink/40">{t('caloriesUnit')}</p>
          </div>
          <div className="rounded-xl bg-white border border-sage-line p-5 text-center">
            <p className="text-sm text-ink/60">{t('tdeeLabel')}</p>
            <p className="mt-1 text-2xl font-bold text-pine">{result.tdee}</p>
            <p className="text-xs text-ink/40">{t('caloriesUnit')}</p>
          </div>
          <div className="rounded-xl bg-white border border-sage-line p-5 text-center">
            <p className="text-sm text-ink/60">{t('proteinLabel')}</p>
            <p className="mt-1 text-2xl font-bold text-pine">{result.proteinLow}–{result.proteinHigh}</p>
            <p className="text-xs text-ink/40">{t('gramsUnit')}</p>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-ink/50 text-center">{t('disclaimer')}</p>
    </form>
  );
}