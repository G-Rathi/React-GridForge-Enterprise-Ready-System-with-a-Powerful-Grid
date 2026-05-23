// Performance profiler utility
export const profiler = {
  startTime: null,
  marks: new Map(),

  start(label = 'default') {
    this.marks.set(label, {
      start: performance.now(),
      measurements: [],
    });
  },

  mark(label = 'default', markLabel) {
    const mark = this.marks.get(label);
    if (mark) {
      mark.measurements.push({
        label: markLabel,
        time: performance.now() - mark.start,
      });
    }
  },

  end(label = 'default') {
    const mark = this.marks.get(label);
    if (mark) {
      const totalTime = performance.now() - mark.start;
      console.group(`Performance Profile: ${label}`);
      mark.measurements.forEach(({ label: markLabel, time }) => {
        console.log(`${markLabel}: ${time.toFixed(2)}ms`);
      });
      console.log(`Total time: ${totalTime.toFixed(2)}ms`);
      console.groupEnd();
      this.marks.delete(label);
    }
  },

  clearAll() {
    this.marks.clear();
  },
};