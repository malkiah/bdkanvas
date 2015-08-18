import threading, time

class TimerObject(object):
    """docstring for TimerObject"""
    def __init__(self, name, stime, num):
        super(TimerObject, self).__init__()
        self.name = name
        self.stime = stime
        self.num = num
        self.thread = threading.Thread(target = self.runfunc)
        self.thread.start()

    def join(self):
        self.thread.join()

    def runfunc(self):
        n = 0
        while n < self.num:
            print(self.name)
            time.sleep(self.stime)
            n = n + 1

t1 = TimerObject("a",1,10)
t2 = TimerObject("b",3,5)
t1.join()
t2.join()
