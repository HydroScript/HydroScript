var count, hydros, hydroscript, random;
(count = 0);(hydros = 0);(hydroscript = 0);while ((count < 10000)) {(random = ((Math["random"]()) * 100));if ((random > 50)) {(hydroscript += 1);(console["log"]("HydroScript +1"));} else {(hydros += 1);(console["log"]("HydroS +1"));};(count += 1);};(console["log"]("HydroS:", hydros));(console["log"]("HydroScript:", hydroscript));
